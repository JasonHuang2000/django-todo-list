/* 
  Public functions
*/

const getCookie = (c_name) => {
  if (document.cookie.length > 0) {
    c_start = document.cookie.indexOf(c_name + "=");
    if (c_start != -1) {
      c_start = c_start + c_name.length + 1;
      c_end = document.cookie.indexOf(";", c_start);
      if (c_end == -1) c_end = document.cookie.length;
      return unescape(document.cookie.substring(c_start, c_end));
    }
  }
  return "";
};

const generateTimeFormat = (str) => {
  if (str === "") return "";
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  const date = new Date(str);
  if (str.charAt(str.length - 1) !== "Z") {
    return `(${date
      .toLocaleString("en-US", options)
      .replace("AM", "a.m.")
      .replace("PM", "p.m.")})`;
  } else if (date.getMinutes() == 0) {
    options.hour = "numeric";
    return `(${date
      .toLocaleString("en-US", options)
      .replace("AM", "a.m.")
      .replace("PM", "p.m.")})`;
  } else {
    options.hour = "numeric";
    options.minute = "2-digit";
    return `(${date
      .toLocaleString("en-US", options)
      .replace("AM", "a.m.")
      .replace("PM", "p.m.")})`;
  }
};

const renderTaskList = (task_objs, editing) => {
  $(".task-button").remove();
  task_objs.forEach((element) => {
    const { content, deadline, done, id } = element;
    const deadline_formatted = generateTimeFormat(deadline);
    $("#list-item-list").append(`
        <button type="button"
          class="list-group-item list-group-item-action task-button"
          id="task-${id}" 
          onclick="onTaskBtnClick(${id})">
          <i class="far me-2 icon"></i> ${content} ${deadline_formatted} 
        </button>`);
    if (done) {
      $(`#task-${id}`).addClass("task-finished");
    }
    if (editing) {
      $(".task-button").addClass("editing").attr({
        "data-bs-toggle": "modal",
        "data-bs-target": "#edit-task-modal",
      });
    }
  });
};

const disableListScrolling = () => {
  $("#list-item-list").on({
    mouseover: () => {
      $(".main").disable();
    },
    mouseleave: () => {
      $(".main").enable();
    },
  });
};

/* 
  Task section
*/

window.onTaskBtnClick = (task_id) => {
  const url = $("#list-form").attr("action");
  if ($("#edit-task-btn").hasClass("editing") === true) {
    const data = {
      csrfmiddlewaretoken: getCookie("csrftoken"),
      event: "get-task-info",
      id: task_id,
    };
    $.post(url, data, (res) => {
      const info = res.taskInfo;
      $("#edit-task-content").val(info.content);
      $("#edit-task-deadline").val(info.deadline.replace("Z", ""));
      $("#edit-task-id").val(info.id);
    });
  } else {
    const data = {
      csrfmiddlewaretoken: getCookie("csrftoken"),
      event: "task-state",
      subject: "done",
      id: task_id,
    };
    $.post(url, data, (res) => {
      renderTaskList(res.taskObjs, false);
    });
  }
};

window.onEditTaskBtnClick = () => {
  const btn = $("#edit-task-btn");
  if (btn.hasClass("editing")) {
    $(".task-button").removeClass("editing").attr({
      "data-bs-toggle": "",
      "data-bs-target": "",
    });
    btn.removeClass("editing");
    btn.html("Edit Task");
  } else {
    $(".task-button").addClass("editing").attr({
      "data-bs-toggle": "modal",
      "data-bs-target": "#edit-task-modal",
    });
    btn.addClass("editing");
    btn.html("Cancel");
  }
};

/*
  Edit task modal
*/

window.onDeleteTaskClick = () => {
  const url = $("#edit-task-form").attr("action");
  const data = {
    csrfmiddlewaretoken: getCookie("csrftoken"),
    event: "task-state",
    subject: "delete",
    id: $("#edit-task-id").val(),
  };
  $.post(url, data, (res) => {
    renderTaskList(res.taskObjs, true);
  });
};

window.onSaveChangesClick = () => {
  const url = $("#edit-task-form").attr("action");
  const data = {
    csrfmiddlewaretoken: getCookie("csrftoken"),
    event: "task-state",
    subject: "update",
    id: $("#edit-task-id").val(),
    content: $("#edit-task-content").val(),
    deadline: $("#edit-task-deadline").val(),
  };
  $.post(url, data, (res) => {
    console.log(res);
    renderTaskList(res.taskObjs, true);
  });
};

/*
  Display options section
*/

window.onDisplayOptionsSubmitClick = () => {
  const url = $("#display-options-form").attr("action");
  const data = {
    csrfmiddlewaretoken: getCookie("csrftoken"),
    event: "display-options",
    method_deadline: $("#deadline-select").val(),
    method_showTask: $("#show-tasks-select").val(),
    method_sortTask: $("#sort-tasks-select").val(),
  };
  $.post(url, data, (res) => {
    renderTaskList(res.taskObjs, false);
    $(".main").moveDown();
  });
};

window.onDisplayOptionsCancelClick = () => $(".main").moveDown();

/* 
  Create new task section
*/

window.onCreateNewSubmitClick = () => {
  const url = $("#new-task-form").attr("action");
  const data = {
    csrfmiddlewaretoken: getCookie("csrftoken"),
    event: "new-task",
    task_content: $("#task-content").val(),
    task_deadline: $("#task-deadline").val(),
  };
  $.post(url, data, (res) => {
    renderTaskList(res.taskObjs);
    $(".main").moveUp();
  });
};

window.onCreateNewCancelClick = () => $(".main").moveUp();

/* 
  Onepage-scroll
*/

const initOnepageScroll = () => {
  $(".main").onepage_scroll({
    sectionContainer: "section", // sectionContainer accepts any kind of selector in case you don't want to use section
    easing: "ease", // Easing options accepts the CSS3 easing animation such "ease", "linear", "ease-in",
    // "ease-out", "ease-in-out", or even cubic bezier value such as "cubic-bezier(0.175, 0.885, 0.420, 1.310)"
    animationTime: 1000, // AnimationTime let you define how long each section takes to animate
    pagination: true, // You can either show or hide the pagination. Toggle true for show, false for hide.
    updateURL: false, // Toggle this true if you want the URL to be updated automatically when the user scroll to each page.
    beforeMove: function (index) {}, // This option accepts a callback function. The function will be called before the page moves.
    afterMove: function (index) {}, // This option accepts a callback function. The function will be called after the page moves.
    loop: false, // You can have the page loop back to the top/bottom when the user navigates at up/down on the first/last page.
    keyboard: true, // You can activate the keyboard controls
    responsiveFallback: false, // You can fallback to normal page scroll by defining the width of the browser in which
    // you want the responsive fallback to be triggered. For example, set this to 600 and whenever
    // the browser's width is less than 600, the fallback will kick in.
    direction: "vertical", // You can now define the direction of the One Page Scroll animation. Options available are "vertical" and "horizontal". The default value is "vertical".
  });
};

const scrollToPage = (idx) => {
  $(".main").moveTo(idx);
};

/* 
  Start up process
*/

$(function () {
  initOnepageScroll();
  disableListScrolling();
  scrollToPage(2);
});
