// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks"));
let nextId = JSON.parse(localStorage.getItem("nextId"));
const modalForm= document.getElementById('formModal');
//Defining task statuses
const TaskStatus= {
    notStarted: 'To Do',
    inProgress: 'In PRogress',
    completed: 'Done'
};
//sample tasks
let tasks= [];
//saving tasks to local storage
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks))
}
//pulls an array from local storage or creates one
let taskArray= JSON.parse(localStorage.getItem('tasks'))||[];

//function to load tasks from LS
function loadTasks() {
    console.log(taskList);
    if (taskList){
        tasks= taskList;
    }
}

// Todo: create a function to generate a unique task id
function generateTaskId() {
    return crypto.randomUUID();
};

// Todo: create a function to create a task card
function createTaskCard(task) {
    //check selectors in html
    const taskCard= $('<div>').addClass("card task-card draggable").attr('data-taskid', task.id)
    const cardBody= $('<div>').addClass("card-body")
    const taskTitle= $('<h3>').text(task.Name);
    const taskDueDate= $('<h3>').text(task.DueDate);
    const taskContent= $('<h3>').text(task.Content);
    const deleteBtn= $('<button>').text(task.delete).attr('data-taskid', task.id)
    .addClass('btn btn-danger delete')
    .text('Delete')
    .attr('data-project-id', task.id);
    deleteBtn.on('click', handleDeleteTask);
    cardBody.append(taskTitle, taskDueDate, taskContent, deleteBtn);
    taskCard.append(cardBody);

    if (task.DueDate && task.status !== 'Done') {
        const now= dayjs();
        let cardDueDate= dayjs(task.DueDate, 'DD/MM/YYYY')
        if (now.isSame(cardDueDate, "day")) {
            taskCard.addClass('bg-warning')
        }else if(now.isAfter(cardDueDate)) {
            taskCard.addClass('bg-danger')
        }else {
            taskCard.addClass('bg-primary')
        }
        console.log(taskCard);
        $('#todo-cards').append(taskCard);
        $('.draggable').draggable({
            zIndex:100,
            revert: 'invalid',
            cursor: 'move'
        });
    }
    return taskCard;

};

// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {
    const todoCol= $('#todo-cards').empty();
    const ipCol= $('#in-progress-cards').empty();
    const doneCol= $('#done-cards').empty();

   tasks.forEach((task, index) =>{
        const taskC= sx
   })
    for (let i = 0; i < taskArray.length; i++) {
        if(taskArray[i].status === "to-do"){
            todoCol.append(createTaskCard(taskArray[i]));
        }
        else if(taskArray[i].status === "in-progress"){
            ipCol.append(createTaskCard(taskArray[i]));
        }
       else{
            doneCol.append(createTaskCard(taskArray[i]));
        }
        
    }
};

const save= $('#save-changes');
save.on('click', function() {
    handleAddTask();
});

// Todo: create a function to handle adding a new task
function handleAddTask(event){
    let task= {
        title: $('#taskTitle').val(),
        DueDate: $('#taskDeadline').val(),
        Content: $('#taskDescription').val(),
        status: "to-do",
        id: crypto.randomUUID(),
    }

    console.log(task);
    taskArray.push(task);
    localStorage.setItem('tasks', JSON.stringify(taskArray));
    renderTaskList();

};

// Todo: create a function to handle deleting a task
function handleDeleteTask(event){
    event.preventDefault();
    const taskId= $(this).attr('data-taskid');
    const tasks= taskArray;

    taskArray= taskArray.filter((task)=> task.id!=taskId);
    localStorage.setItem('tasks', JSON.stringify(taskArray));
    renderTaskList();
}

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {
    const taskId= ui.draggable[0].dataset.taskid;
    console.log(taskId);
    const newStatus= event.target.id;
    console.log(newStatus);

    for (const task of taskArray) {
        if (task.id === taskId){
            task.status= newStatus;
        }
    }
    localStorage.setItem('tasks', JSON.stringify(taskArray));
    renderTaskList();
}


// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {
    $(modalForm).on('submit', function(event){
        event.preventDefault();
        handleAddTask(event);

    }) 
    renderTaskList();
    $('.lane').droppable({
        accept: '.draggable',
        drop: handleDrop,
    });
});

