from django.shortcuts import render, get_object_or_404
from django.http import HttpResponseRedirect, JsonResponse
from django.urls import reverse
from .models import TodoList, Task

# Create your views here.


def index(request):
    todoListArr = TodoList.objects.order_by('id')
    context = {
        'todoListArr': todoListArr,
    }
    return render(request, 'main/index.html', context)


class Config:

    def __init__(self):
        self.task_display_method = 0
        self.task_sort_method = 0
        self.deadline_display_method = 0

    def setTaskDisplayMethod(self, option: int):
        '''
        - [ 0 ] show all tasks
        - [ 1 ] show undone tasks only
        '''
        self.task_display_method = option

    def setTaskSortMethod(self, option: int):
        '''
        - [ 0 ] sort by deadline
        - [ 1 ] sort by content (dictionary order)
        - [ 2 ] sort by done/undone tasks (done tasks first)
        '''
        self.task_sort_method = option

    def setDeadlineDisplayMethod(self, option: int):
        '''
        - [ 0 ] display full deadline
        - [ 1 ] display deadline date
        - [ 2 ] hide
        '''
        self.deadline_display_method = option


def generateTaskObjects(conf: Config, tl: TodoList) -> list:

    task_objs = []

    if conf.task_sort_method == 0:
        tasks = tl.task_set.order_by('deadline')
    elif conf.task_sort_method == 1:
        tasks = tl.task_set.order_by('content')
    elif conf.task_sort_method == 2:
        tasks = tl.task_set.order_by('-done')
    else:
        raise

    if conf.task_display_method == 0:
        pass
    elif conf.task_display_method == 1:
        tasks = [task for task in tasks if task.done == False]
    else:
        raise

    for task in tasks:
        if conf.deadline_display_method == 0:
            deadline = task.deadline
        elif conf.deadline_display_method == 1:
            deadline = task.deadline.date()
        elif conf.deadline_display_method == 2:
            deadline = ''
        else:
            raise
        task_obj = {
            'id': task.id,
            'content': task.content,
            'deadline': deadline,
            'done': task.done,
        }
        task_objs.append(task_obj)

    return task_objs


conf = Config()


def todoList(request, list_id):

    tl = get_object_or_404(TodoList, id=list_id)

    if request.POST:
        print(request.POST)

        try:
            event = request.POST['event']
            if event == 'get-task-info':
                task_id = int(request.POST['id'])
                task = tl.task_set.get(id=task_id)
                return JsonResponse({
                    'taskInfo': {
                        'id': task.id,
                        'content': task.content,
                        'deadline': task.deadline,
                        'done': task.done,
                    },
                })
            elif event == 'task-state':
                subject = request.POST['subject']
                task_id = int(request.POST['id'])
                t = tl.task_set.get(id=task_id)
                if subject == 'done':
                    t.done = not t.done
                    t.save()
                elif subject == 'update':
                    t.content = request.POST['content']
                    t.deadline = request.POST['deadline']
                    t.save()
                elif subject == 'delete':
                    t.delete()
                return JsonResponse({
                    'taskObjs': generateTaskObjects(conf, tl)
                })
            elif event == 'display-options':
                method_deadline = int(request.POST['method_deadline'])
                method_showTask = int(request.POST['method_showTask'])
                method_sortTask = int(request.POST['method_sortTask'])
                conf.setDeadlineDisplayMethod(method_deadline)
                conf.setTaskDisplayMethod(method_showTask)
                conf.setTaskSortMethod(method_sortTask)
                return JsonResponse({
                    'taskObjs': generateTaskObjects(conf, tl)
                })
            elif event == 'new-task':
                content = request.POST['task_content']
                deadline = request.POST['task_deadline']
                tl.task_set.create(
                    content=content, deadline=deadline, done=False)
                return JsonResponse({
                    'taskObjs': generateTaskObjects(conf, tl)
                })
            else:
                raise
        except:
            pass

    context = {
        'listID': list_id,
        'title': tl.title,
        'taskObjs': generateTaskObjects(conf, tl),
    }
    return render(request, 'main/list.html', context)
