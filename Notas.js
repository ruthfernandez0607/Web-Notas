// Cargar nombre del usuario si ya está guardado
window.onload = () => {
    const savedUsername = localStorage.getItem("username");
    const username = document.getElementById("username");
    const nameContainer = document.querySelector(".name-container");

    if (savedUsername) {
        username.textContent = `Hola, ${savedUsername}!`;
        nameContainer.style.display = "none"; // Ocultar input y botón si el nombre ya está guardado
    }

    // Recuperar las notas guardadas
    loadNotes();
};

// Guardar el nombre del usuario y mostrar el saludo
function setUsername() {
    const nameInput = document.getElementById("nameInput");
    const username = document.getElementById("username");

    if (nameInput.value.trim() !== "") {
        localStorage.setItem("username", nameInput.value.trim());
        username.textContent = `Hola, ${nameInput.value.trim()}!`;

        // Ocultar el campo de entrada y el botón
        document.querySelector(".name-container").style.display = "none";
    } else {
        alert("Por favor, ingresa tu nombre.");
    }
}

// Previsualizar la imagen seleccionada
const imageInput = document.getElementById("imageInput");
const imagePreview = document.getElementById("imagePreview");

imageInput.addEventListener("change", () => {
    if (imageInput.files && imageInput.files[0]) {
        const reader = new FileReader();

        reader.onload = (e) => {
            imagePreview.innerHTML = `
                <img src="${e.target.result}" alt="Previsualización de imagen">
            `;
        };

        reader.readAsDataURL(imageInput.files[0]);
    } else {
        imagePreview.innerHTML = ""; // Si no hay archivo seleccionado, limpiar previsualización
    }
});

// Guardar una nueva nota
function saveNote() {
    const noteInput = document.getElementById("noteInput");
    const savedNotes = document.getElementById("savedNotes");

    if (noteInput.value.trim() !== "") {
        const note = {
            content: noteInput.value,
            date: new Date().toLocaleString(),
            image: imageInput.files[0] ? URL.createObjectURL(imageInput.files[0]) : null,
        };

        // Agregar la nota a la lista de notas en localStorage
        const notes = JSON.parse(localStorage.getItem("notes")) || [];
        notes.push(note);
        localStorage.setItem("notes", JSON.stringify(notes));

        // Renderizar la nota en la interfaz
        renderNote(note);

        // Limpiar los campos de entrada
        noteInput.value = "";
        imageInput.value = "";
        imagePreview.innerHTML = ""; // Limpiar la previsualización
    } else {
        alert("Por favor, escribe algo en la nota.");
    }
}

// Renderizar una nota en la interfaz
function renderNote(note) {
    const savedNotes = document.getElementById("savedNotes");
    const noteElement = document.createElement("div");
    noteElement.classList.add("saved-note");

    noteElement.innerHTML = `
        <p>${note.content}</p>
        <small>${note.date}</small>
        ${note.image ? `<img src="${note.image}" alt="Nota imagen">` : ""}
        <button onclick="deleteNote(this)">Borrar</button>
    `;

    // Agregar evento de clic para mostrar la nota en grande
    noteElement.addEventListener("click", () => {
        showModal(note);
    });

    savedNotes.appendChild(noteElement);
}

// Mostrar el modal con la nota seleccionada
function showModal(note) {
    const modal = document.getElementById("noteModal");
    const modalContent = document.getElementById("modalContent");

    modalContent.innerHTML = `
        <h2>Nota</h2>
        <p>${note.content}</p>
        <small>${note.date}</small>
        ${note.image ? `<img src="${note.image}" alt="Imagen de la nota">` : ""}
        <button onclick="closeModal()">Cerrar</button>
    `;

    modal.style.display = "flex";
}

// Cerrar el modal
function closeModal() {
    const modal = document.getElementById("noteModal");
    modal.style.display = "none";
}

// Cargar las notas guardadas en localStorage
function loadNotes() {
    const notes = JSON.parse(localStorage.getItem("notes")) || [];
    notes.forEach((note) => {
        renderNote(note);
    });
}

// Eliminar una nota
function deleteNote(button) {
    const noteElement = button.parentElement;
    const noteContent = noteElement.querySelector("p").textContent;

    // Eliminar la nota de la interfaz
    noteElement.remove();

    // Eliminar la nota de localStorage
    let notes = JSON.parse(localStorage.getItem("notes")) || [];
    notes = notes.filter((note) => note.content !== noteContent);
    localStorage.setItem("notes", JSON.stringify(notes));
}
