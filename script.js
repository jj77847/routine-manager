(() => {
  // Default routines data
  const defaultRoutines = [
    {
      id: "rings",
      name: "Rings Workout",
      colorClass: "routine-rings",
      info: "3×30s Ring Supports, 5×1 Skin the Cat, 3×5 Ring Dips, 3×5 Ring Rows, 3×10 Ring Press-ups, 3×10 Ring Squats.",
      exercises: [
        { name: "Ring Supports", sets: 3, reps: "30s" },
        { name: "Skin the Cat", sets: 5, reps: 1 },
        { name: "Ring Dips", sets: 3, reps: 5 },
        { name: "Ring Rows", sets: 3, reps: 5 },
        { name: "Ring Press-ups", sets: 3, reps: 10 },
        { name: "Ring Squats", sets: 3, reps: 10 }
      ]
    },
    {
      id: "park",
      name: "Park Workout",
      colorClass: "routine-park",
      info: "Circuit includes squats, pull-ups, push-ups, dips, knee raises, and jogging.",
      exercises: [
        { name: "Squats", sets: 1, reps: 10 },
        { name: "Pull-Ups", sets: 4, reps: [3,3,3,1] },
        { name: "Push-Ups", sets: 1, reps: 10 },
        { name: "Dips", sets: 2, reps: 5 },
        { name: "Knee Raises", sets: 1, reps: 10 },
        { name: "Jog", sets: 1, reps: "10 min" }
      ]
    },
    {
      id: "home",
      name: "Home Workout",
      colorClass: "routine-home",
      info: "Home workout with press-ups, assisted squats, burpees and planks.",
      exercises: [
        { name: "Press-Ups", sets: 5, reps: 10 },
        { name: "Assisted Squats", sets: 5, reps: 10 },
        { name: "Burpees", sets: 5, reps: 10 },
        { name: "Plank", sets: 5, reps: "1 min" }
      ]
    }
  ];

  const routineSelect = document.getElementById("routine-select");
  const routineContainer = document.getElementById("routine-container");
  const resetBtn = document.getElementById("reset-btn");

  // Load routines from localStorage or default
  function loadRoutines() {
    const saved = localStorage.getItem("routinesData");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return [...defaultRoutines];
      }
    }
    return [...defaultRoutines];
  }

  // Save routines to localStorage
  function saveRoutines(data) {
    localStorage.setItem("routinesData", JSON.stringify(data));
  }

  let routines = loadRoutines();

  // Populate dropdown
  function populateDropdown() {
    routineSelect.innerHTML = "";
    routines.forEach(r => {
      const option = document.createElement("option");
      option.value = r.id;
      option.textContent = r.name;
      routineSelect.appendChild(option);
    });
  }

  // Render routine details
  function renderRoutine(routine) {
    routineContainer.className = "routine-container " + routine.colorClass;
    routineContainer.innerHTML = "";

    const title = document.createElement("h2");
    title.className = "routine-title";
    title.textContent = routine.name;
    routineContainer.appendChild(title);

    if (routine.info) {
      const info = document.createElement("p");
      info.className = "routine-info";
      info.textContent = routine.info;
      routineContainer.appendChild(info);
    }

    // Exercises list
    const ul = document.createElement("ul");
    ul.className = "exercise-list";

    routine.exercises.forEach((ex, i) => {
      const li = document.createElement("li");

      const span = document.createElement("span");
      span.textContent = ex.name + " — Sets: ";
      li.appendChild(span);

      // Sets input
      const setsInput = document.createElement("input");
      setsInput.type = "number";
      setsInput.min = 0;
      setsInput.value = ex.sets;
      setsInput.title = "Sets";
      setsInput.style.width = "50px";
      setsInput.addEventListener("change", e => {
        const val = parseInt(e.target.value, 10);
        if (!isNaN(val) && val >= 0) {
          routines.find(r => r.id === routine.id).exercises[i].sets = val;
          saveRoutines(routines);
        } else {
          e.target.value = routines.find(r => r.id === routine.id).exercises[i].sets;
        }
      });
      li.appendChild(setsInput);

      const repsSpan = document.createElement("span");
      repsSpan.textContent = " Reps: ";
      li.appendChild(repsSpan);

      // Reps input
      const repsInput = document.createElement("input");
      repsInput.type = "text";
      repsInput.value = Array.isArray(ex.reps) ? ex.reps.join(", ") : ex.reps;
      repsInput.title = "Reps (number, time, or list)";
      repsInput.style.width = "100px";
      repsInput.addEventListener("change", e => {
        let val = e.target.value.trim();
        // If comma separated numbers, convert to array of numbers
        if (val.includes(",")) {
          const arr = val.split(",").map(x => x.trim());
          // Try convert numeric strings to numbers
          const converted = arr.map(x => isNaN(x) ? x : Number(x));
          routines.find(r => r.id === routine.id).exercises[i].reps = converted;
        } else if (!isNaN(val)) {
          routines.find(r => r.id === routine.id).exercises[i].reps = Number(val);
        } else {
          routines.find(r => r.id === routine.id).exercises[i].reps = val;
        }
        saveRoutines(routines);
      });
      li.appendChild(repsInput);

      // Delete button
      const delBtn = document.createElement("button");
      delBtn.textContent = "Delete";
      delBtn.title = "Delete exercise";
      delBtn.addEventListener("click", () => {
        if (confirm(`Delete exercise "${ex.name}"?`)) {
          const routineIndex = routines.findIndex(r => r.id === routine.id);
          if (routineIndex > -1) {
            routines[routineIndex].exercises.splice(i, 1);
            saveRoutines(routines);
            renderRoutine(routines[routineIndex]);
          }
        }
      });
      li.appendChild(delBtn);

      ul.appendChild(li);
    });

    routineContainer.appendChild(ul);

    // Add new exercise form
    const addDiv = document.createElement("div");
    addDiv.className = "add-exercise";

    const addInput = document.createElement("input");
    addInput.type = "text";
    addInput.placeholder = "New exercise name";
    addInput.title = "Enter new exercise name";
    addDiv.appendChild(addInput);

    const addSets = document.createElement("input");
    addSets.type = "number";
    addSets.min = 0;
    addSets.placeholder = "Sets";
    addSets.title = "Sets";
    addSets.style.width = "60px";
    addDiv.appendChild(addSets);

    const addReps = document.createElement("input");
    addReps.type = "text";
    addReps.placeholder = "Reps (e.g. 10 or 10,5,5 or 30s)";
    addReps.title = "Reps";
    addReps.style.width = "100px";
    addDiv.appendChild(addReps);

    const addBtn = document.createElement("button");
    addBtn.textContent = "Add Exercise";
    addBtn.title = "Add exercise to routine";
    addBtn.addEventListener("click", () => {
      const name = addInput.value.trim();
      const sets = parseInt(addSets.value, 10);
      const repsRaw = addReps.value.trim();

      if (!name) {
        alert("Please enter exercise name.");
        return;
      }
      if (isNaN(sets) || sets < 0) {
        alert("Please enter valid number of sets.");
        return;
      }
      if (!repsRaw) {
        alert("Please enter reps.");
        return;
      }

      let reps;
      if (repsRaw.includes(",")) {
        reps = repsRaw.split(",").map(x => {
          const n = x.trim();
          return isNaN(n) ? n : Number(n);
        });
      } else if (!isNaN(repsRaw)) {
        reps = Number(repsRaw);
      } else {
        reps = repsRaw;
      }

      const routineIndex = routines.findIndex(r => r.id === routine.id);
      if (routineIndex > -1) {
        routines[routineIndex].exercises.push({ name, sets, reps });
        saveRoutines(routines);
        renderRoutine(routines[routineIndex]);
        addInput.value = "";
        addSets.value = "";
        addReps.value = "";
      }
    });
    addDiv.appendChild(addBtn);

    routineContainer.appendChild(addDiv);
  }

  // Event: on routine select change
  routineSelect.addEventListener("change", e => {
    const selectedId = e.target.value;
    const routine = routines.find(r => r.id === selectedId);
    if (routine) {
      renderRoutine(routine);
    }
  });

  // Reset to defaults
  resetBtn.addEventListener("click", () => {
    if (confirm("Are you sure you want to reset all routines to defaults? This will erase all your edits.")) {
      routines = [...defaultRoutines];
      saveRoutines(routines);
      populateDropdown();
      routineSelect.selectedIndex = 0;
      renderRoutine(routines[0]);
    }
  });

  // Init app
  function init() {
    populateDropdown();
    // Show first routine by default
    if (routines.length > 0) {
      routineSelect.value = routines[0].id;
      renderRoutine(routines[0]);
    }
  }

  init();
})();
