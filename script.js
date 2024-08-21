var addButton = document.getElementById("add-button");
var toDoEntryBox = document.getElementById("todo-entry-box");
var toDoList = document.getElementById("todo-list");
var taskCount = document.getElementById("task-count");

addButton.addEventListener("click", addToDoItem);

function updateTaskCount() {
    var totalTasks = toDoList.children.length;
    var completedTasks = toDoList.getElementsByClassName("completed").length;
    taskCount.textContent = completedTasks + " / " + totalTasks;
    
    if (completedTasks === totalTasks && totalTasks > 0) {
        fireConfetti();
    }
}

function newToDoItem(itemText, completed) {
    var toDoItem = document.createElement("li");
    var checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.classList.add("checkbox");
    checkbox.checked = completed;
    checkbox.addEventListener("change", toggleToDoItemState);
    
    var textSpan = document.createElement("span");
    textSpan.textContent = itemText;
    textSpan.contentEditable = true;
    textSpan.addEventListener("blur", finishEditing);
    
    var editButton = document.createElement("button");
    editButton.innerHTML = '<i class="fas fa-edit"></i>';
    editButton.classList.add("edit-button");
    editButton.addEventListener("click", editToDoItem);
    
    var saveButton = document.createElement("button");
    saveButton.innerHTML = '<i class="fas fa-save"></i>';
    saveButton.classList.add("save-button");
    saveButton.style.display = "none";
    saveButton.addEventListener("click", saveToDoItem);
    
    var deleteButton = document.createElement("button");
    deleteButton.innerHTML = '<i class="fas fa-trash"></i>';
    deleteButton.classList.add("delete-button");
    deleteButton.addEventListener("click", deleteToDoItem);
    
    toDoItem.appendChild(checkbox);
    toDoItem.appendChild(textSpan);
    toDoItem.appendChild(editButton);
    toDoItem.appendChild(saveButton);
    toDoItem.appendChild(deleteButton);
    
    if (completed) {
        toDoItem.classList.add("completed");
    }
    
    toDoList.appendChild(toDoItem);
    updateTaskCount();
}

function addToDoItem(e) {
    e.preventDefault();
    var itemText = toDoEntryBox.value;
    if (itemText !== "") {
        newToDoItem(itemText, false);
        toDoEntryBox.value = "";
    }
}

function toggleToDoItemState() {
    var listItem = this.parentNode;
    listItem.classList.toggle("completed");
    updateTaskCount();
}

function editToDoItem() {
    var listItem = this.parentNode;
    var textSpan = listItem.querySelector("span");
    var saveButton = listItem.querySelector(".save-button");
    
    textSpan.contentEditable = true;
    textSpan.focus();
    
    this.style.display = "none";
    saveButton.style.display = "inline-block";
}

function saveToDoItem() {
    var listItem = this.parentNode;
    var textSpan = listItem.querySelector("span");
    var editButton = listItem.querySelector(".edit-button");
    
    textSpan.contentEditable = false;
    
    this.style.display = "none";
    editButton.style.display = "inline-block";
    
    saveToLocalStorage();
}

function deleteToDoItem() {
    var listItem = this.parentNode;
    toDoList.removeChild(listItem);
    updateTaskCount();
    
    saveToLocalStorage();
}

function saveToLocalStorage() {
    var toDos = [];
    var items = toDoList.getElementsByTagName("li");
    
    for (var i = 0; i < items.length; i++) {
        var item = items[i];
        var textSpan = item.querySelector("span");
        var checkbox = item.querySelector(".checkbox");
        
        toDos.push({
            task: textSpan.textContent,
            completed: checkbox.checked
        });
    }
    
    localStorage.setItem("toDos", JSON.stringify(toDos));
}

function finishEditing() {
    this.contentEditable = false;
    this.contentEditable = true;
}

function clearCompletedToDoItems() {
    var completedItems = toDoList.getElementsByClassName("completed");
    while (completedItems.length > 0) {
        completedItems[0].remove();
    }
    updateTaskCount();
}

function emptyList() {
    while (toDoList.firstChild) {
        toDoList.removeChild(toDoList.firstChild);
    }
    updateTaskCount();
}

function loadList() {
    if (localStorage.getItem("toDos") != null) {
        var toDos = JSON.parse(localStorage.getItem("toDos"));
        for (var i = 0; i < toDos.length; i++) {
            var toDo = toDos[i];
            newToDoItem(toDo.task, toDo.completed);
        }
    }
}

loadList();

function fireConfetti() {
    const count = 200,
    defaults = {
        origin: { y: 0.7 }
    };

    function fire(particleRatio, opts) {
        confetti(
            Object.assign({}, defaults, opts, {
                particleCount: Math.floor(count * particleRatio)
            })
        );
    }

    fire(0.25, {
        spread: 26,
        startVelocity: 55
    });

    fire(0.2, {
        spread: 60
    });

    fire(0.35, {
        spread: 100,
        decay: 0.91,
        scalar: 0.8
    });

    fire(0.1, {
        spread: 120,
        startVelocity: 25,
        decay: 0.92,
        scalar: 1.2
    });

    fire(0.1, {
        spread: 120,
        startVelocity: 45
    });
}

window.addEventListener("beforeunload", saveToLocalStorage);