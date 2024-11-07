
document.addEventListener("DOMContentLoaded", () => {
    const taskForm = document.getElementById("taskForm");
    const taskInput = document.getElementById("taskInput");
    const taskList = document.getElementById("taskList");
    const filterButtons = document.querySelectorAll(".filter-buttons button");
    
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

    const renderTasks = (filter = "all") => {
        taskList.innerHTML = "";
        let filteredTasks = tasks;

        if (filter === "active") {
            filteredTasks = tasks.filter(task => !task.completed);
        } else if (filter === "completed") {
            filteredTasks = tasks.filter(task => task.completed);
        }

        filteredTasks.forEach(task => {
            const taskItem = document.createElement("li");
            taskItem.classList.add("task-item");
            if (task.completed) taskItem.classList.add("completed");

            taskItem.innerHTML = `
                <span>${task.text}</span>
                <div>
                    <button onclick="toggleTask('${task.id}')">✓</button>
                    <button onclick="deleteTask('${task.id}')">X</button>
                </div>
            `;
            taskList.appendChild(taskItem);
        });
    };

    const saveTasks = () => {
        localStorage.setItem("tasks", JSON.stringify(tasks));
    };

    taskForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const newTask = {
            id: Date.now().toString(),
            text: taskInput.value,
            completed: false
        };
        tasks.push(newTask);
        taskInput.value = "";
        saveTasks();
        renderTasks();
    });

    window.toggleTask = (taskId) => {
        tasks = tasks.map(task => 
            task.id === taskId ? { ...task, completed: !task.completed } : task
        );
        saveTasks();
        renderTasks();
    };

    window.deleteTask = (taskId) => {
        tasks = tasks.filter(task => task.id !== taskId);
        saveTasks();
        renderTasks();
    };

    filterButtons.forEach(button => {
        button.addEventListener("click", () => {
            document.querySelector(".filter-buttons .active").classList.remove("active");
            button.classList.add("active");
            const filter = button.id.replace("filter", "").toLowerCase();
            renderTasks(filter);
        });
    });

    renderTasks(); 
});
