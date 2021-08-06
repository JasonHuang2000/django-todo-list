/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./assets/list.js":
/*!************************!*\
  !*** ./assets/list.js ***!
  \************************/
/***/ (() => {

eval("/* \n  Public functions\n*/\n\nconst getCookie = (c_name) => {\n  if (document.cookie.length > 0) {\n    c_start = document.cookie.indexOf(c_name + \"=\");\n    if (c_start != -1) {\n      c_start = c_start + c_name.length + 1;\n      c_end = document.cookie.indexOf(\";\", c_start);\n      if (c_end == -1) c_end = document.cookie.length;\n      return unescape(document.cookie.substring(c_start, c_end));\n    }\n  }\n  return \"\";\n};\n\nconst generateTimeFormat = (str) => {\n  if (str === \"\") return \"\";\n  const options = {\n    year: \"numeric\",\n    month: \"long\",\n    day: \"numeric\",\n  };\n  const date = new Date(str);\n  if (str.charAt(str.length - 1) !== \"Z\") {\n    return `(${date\n      .toLocaleString(\"en-US\", options)\n      .replace(\"AM\", \"a.m.\")\n      .replace(\"PM\", \"p.m.\")})`;\n  } else if (date.getMinutes() == 0) {\n    options.hour = \"numeric\";\n    return `(${date\n      .toLocaleString(\"en-US\", options)\n      .replace(\"AM\", \"a.m.\")\n      .replace(\"PM\", \"p.m.\")})`;\n  } else {\n    options.hour = \"numeric\";\n    options.minute = \"2-digit\";\n    return `(${date\n      .toLocaleString(\"en-US\", options)\n      .replace(\"AM\", \"a.m.\")\n      .replace(\"PM\", \"p.m.\")})`;\n  }\n};\n\nconst renderTaskList = (task_objs) => {\n  $(\".task-button\").remove();\n  task_objs.forEach((element) => {\n    const { content, deadline, done, id } = element;\n    const deadline_formatted = generateTimeFormat(deadline);\n    $(\"#list-item-list\").append(`\n        <button type=\"button\"\n          class=\"list-group-item list-group-item-action task-button\"\n          id=\"task-${id}\" \n          onclick=\"onTaskBtnClick(${id})\">\n          <i class=\"far me-2 icon\"></i> ${content} ${deadline_formatted} \n        </button>`);\n    if (done) {\n      $(`#task-${id}`).addClass(\"task-finished\");\n    }\n  });\n};\n\nconst disableListScrolling = () => {\n  $(\"#list-item-list\").on({\n    mouseover: () => {\n      $(\".main\").disable();\n    },\n    mouseleave: () => {\n      $(\".main\").enable();\n    },\n  });\n};\n\n/* \n  Task section\n*/\n\nwindow.onTaskBtnClick = (task_id) => {\n  const url = $(\"#list-form\").attr(\"action\");\n  if ($(\"#edit-task-btn\").hasClass(\"editing\") === true) {\n    const data = {\n      csrfmiddlewaretoken: getCookie(\"csrftoken\"),\n      event: \"get-task-info\",\n      id: task_id,\n    };\n    $.post(url, data, (res) => {\n      const info = res.taskInfo;\n      $(\"#edit-task-content\").val(info.content);\n      $(\"#edit-task-deadline\").val(info.deadline.replace(\"Z\", \"\"));\n      $(\"#edit-task-id\").val(info.id);\n    });\n  } else {\n    const data = {\n      csrfmiddlewaretoken: getCookie(\"csrftoken\"),\n      event: \"task-state\",\n      subject: \"done\",\n      id: task_id,\n    };\n    $.post(url, data, (res) => {\n      renderTaskList(res.taskObjs);\n    });\n  }\n};\n\nwindow.onEditTaskBtnClick = () => {\n  const btn = $(\"#edit-task-btn\");\n  if (btn.hasClass(\"editing\") === true) {\n    $(\".task-button\").removeClass(\"editing\").attr({\n      \"data-bs-toggle\": \"\",\n      \"data-bs-target\": \"\",\n    });\n    btn.removeClass(\"editing\");\n    btn.html(\"Edit Task\");\n  } else {\n    $(\".task-button\").addClass(\"editing\").attr({\n      \"data-bs-toggle\": \"modal\",\n      \"data-bs-target\": \"#edit-task-modal\",\n    });\n    btn.addClass(\"editing\");\n    btn.html(\"Cancel\");\n  }\n};\n\n/*\n  Edit task modal\n*/\n\nwindow.onDeleteTaskClick = () => {\n  const url = $(\"#edit-task-form\").attr(\"action\");\n  const data = {\n    csrfmiddlewaretoken: getCookie(\"csrftoken\"),\n    event: \"task-state\",\n    subject: \"delete\",\n    id: $(\"#edit-task-id\").val(),\n  };\n  $.post(url, data, (res) => {\n    renderTaskList(res.taskObjs);\n  });\n};\n\nwindow.onSaveChangesClick = () => {\n  const url = $(\"#edit-task-form\").attr(\"action\");\n  const data = {\n    csrfmiddlewaretoken: getCookie(\"csrftoken\"),\n    event: \"task-state\",\n    subject: \"update\",\n    id: $(\"#edit-task-id\").val(),\n    content: $(\"#edit-task-content\").val(),\n    deadline: $(\"#edit-task-deadline\").val(),\n  };\n  $.post(url, data, (res) => {\n    console.log(res);\n    renderTaskList(res.taskObjs);\n  });\n};\n\n/*\n  Display options section\n*/\n\nwindow.onDisplayOptionsSubmitClick = () => {\n  const url = $(\"#display-options-form\").attr(\"action\");\n  const data = {\n    csrfmiddlewaretoken: getCookie(\"csrftoken\"),\n    event: \"display-options\",\n    method_deadline: $(\"#deadline-select\").val(),\n    method_showTask: $(\"#show-tasks-select\").val(),\n    method_sortTask: $(\"#sort-tasks-select\").val(),\n  };\n  $.post(url, data, (res) => {\n    renderTaskList(res.taskObjs);\n    $(\".main\").moveDown();\n  });\n};\n\nwindow.onDisplayOptionsCancelClick = () => $(\".main\").moveDown();\n\n/* \n  Create new task section\n*/\n\nwindow.onCreateNewSubmitClick = () => {\n  const url = $(\"#new-task-form\").attr(\"action\");\n  const data = {\n    csrfmiddlewaretoken: getCookie(\"csrftoken\"),\n    event: \"new-task\",\n    task_content: $(\"#task-content\").val(),\n    task_deadline: $(\"#task-deadline\").val(),\n  };\n  $.post(url, data, (res) => {\n    renderTaskList(res.taskObjs);\n    $(\".main\").moveUp();\n  });\n};\n\nwindow.onCreateNewCancelClick = () => $(\".main\").moveUp();\n\n/* \n  Onepage-scroll\n*/\n\nconst initOnepageScroll = () => {\n  $(\".main\").onepage_scroll({\n    sectionContainer: \"section\", // sectionContainer accepts any kind of selector in case you don't want to use section\n    easing: \"ease\", // Easing options accepts the CSS3 easing animation such \"ease\", \"linear\", \"ease-in\",\n    // \"ease-out\", \"ease-in-out\", or even cubic bezier value such as \"cubic-bezier(0.175, 0.885, 0.420, 1.310)\"\n    animationTime: 1000, // AnimationTime let you define how long each section takes to animate\n    pagination: true, // You can either show or hide the pagination. Toggle true for show, false for hide.\n    updateURL: false, // Toggle this true if you want the URL to be updated automatically when the user scroll to each page.\n    beforeMove: function (index) {}, // This option accepts a callback function. The function will be called before the page moves.\n    afterMove: function (index) {}, // This option accepts a callback function. The function will be called after the page moves.\n    loop: false, // You can have the page loop back to the top/bottom when the user navigates at up/down on the first/last page.\n    keyboard: true, // You can activate the keyboard controls\n    responsiveFallback: false, // You can fallback to normal page scroll by defining the width of the browser in which\n    // you want the responsive fallback to be triggered. For example, set this to 600 and whenever\n    // the browser's width is less than 600, the fallback will kick in.\n    direction: \"vertical\", // You can now define the direction of the One Page Scroll animation. Options available are \"vertical\" and \"horizontal\". The default value is \"vertical\".\n  });\n};\n\nconst scrollToPage = (idx) => {\n  $(\".main\").moveTo(idx);\n};\n\n/* \n  Start up process\n*/\n\n$(function () {\n  initOnepageScroll();\n  disableListScrolling();\n  scrollToPage(2);\n});\n\n\n//# sourceURL=webpack://todo_list/./assets/list.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./assets/list.js"]();
/******/ 	
/******/ })()
;