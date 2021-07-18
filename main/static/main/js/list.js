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

const onTaskButtonClick = (task_id) => {
  const url = $("#list-form").attr("action");
  const data = {
    csrfmiddlewaretoken: getCookie("csrftoken"),
    event: "taskStateChange",
    subject: "done",
    id: task_id,
  };
  $.post(url, data, (res) => {
    if (res.done === true) {
      $(`#list-item-list #${res.id}`).addClass("task-finished");
    } else {
      $(`#list-item-list #${res.id}`).removeClass("task-finished");
    }
  });
};

const onDisplayOptionsButtonClick = () => {};
