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


display = {
    'showDeadline': '0',
    'showItem': '0',
    'sortItem': '0',
}


def todoList(request, list_id):

    tl = get_object_or_404(TodoList, id=list_id)

    if request.POST:
        print(request.POST)

        try:
            event = request.POST['event']
            if (event == 'taskState'):
                subject = request.POST['subject']
                task_id = request.POST['id']
                if (subject == 'done'):
                    t = tl.task_set.get(id=task_id)
                    t.done = not t.done
                    t.save()
                    return JsonResponse({
                        'id': task_id,
                        'done': t.done,
                    })
        except:
            pass

        # show deadline
        try:
            method = request.POST['deadline']
            if method != '':
                display['showDeadline'] = method
        except:
            pass
        # show items
        try:
            method = request.POST['show-tasks']
            if method != '':
                display['showItem'] = method
        except:
            pass
        # sort items
        try:
            method = request.POST['sort-tasks']
            if method != '':
                display['sortItem'] = method
        except:
            pass
        # new task
        try:
            content = request.POST['task-content']
            deadline = request.POST['task-deadline']
            tl.task_set.create(content=content, deadline=deadline, done=False)
        except:
            pass

    # sort task
    '''
        options:
        0.  sort by deadline
        1.  sort by content (dictionary order)
        2.  sort by done/undone tasks (done tasks first)
    '''
    if display['sortItem'] == '0':
        tasks = tl.task_set.order_by('deadline')
    elif display['sortItem'] == '1':
        tasks = tl.task_set.order_by('content')
    elif display['sortItem'] == '2':
        tasks = tl.task_set.order_by('-done')
    else:
        raise

    # show task
    '''
        options: 
        0.  show all tasks
        1.  show undone tasks only 
    '''
    if display['showItem'] == '0':
        pass
    elif display['showItem'] == '1':
        tasks = [task for task in tasks if task.done == False]
    else:
        raise

    # display deadline
    '''
        options:
        0.  display full deadline
        1.  display deadline date
        2.  hide
    '''
    task_objs = []
    for task in tasks:
        task_obj = {}
        if display['showDeadline'] == '1':
            task_obj['date'] = task.deadline.date()
        elif display['showDeadline'] not in ['0', '2']:
            raise
        task_obj['task'] = task
        task_objs.append(task_obj)

    context = {
        'listID': list_id,
        'title': tl.title,
        'taskObjs': task_objs,
        'display': display,
    }
    return render(request, 'main/list.html', context)
