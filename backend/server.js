const express = require("express");
const cors = require("cors");
const app = express();
const port = 8000;

// Middleware to parse incoming requests
app.use(cors());
app.use(express.json());

// Simulated API data for cascading form
const formStructure = [
  {
    checked: true,
    description: "Choose an option.",
    disabled: false,
    label: "server",
    name: "servers",
    options: ["Server 1", "Server 2", "Server 3"],
    placeholder: "servers",
    required: true,
    rowIndex: 0,
    type: "",
    value: "",
    variant: "Select",
  },
  {
    checked: true,
    description: "Choose an option.",
    disabled: false,
    label: "Database",
    name: "Database",
    options: ["MySQL", "PostgreSQL", "MongoDB"],
    placeholder: "Database",
    required: true,
    rowIndex: 0,
    type: "",
    value: "",
    variant: "Select",
  },
  {
    checked: true,
    description: "Enter your username.",
    disabled: false,
    label: "Username",
    name: "Username",
    placeholder: "Username",
    required: true,
    rowIndex: 0,
    type: "text",
    value: "",
    variant: "Input",
  },
  {
    checked: true,
    description: "Enter your password.",
    disabled: false,
    label: "Password",
    name: "Password",
    placeholder: "Password",
    required: true,
    rowIndex: 1,
    type: "password",
    value: "",
    variant: "Input",
  },
  {
    checked: true,
    description: "Choose an option.",
    disabled: false,
    label: "Default Select Label",
    name: "another select1",
    placeholder: "Placeholder",
    required: true,
    rowIndex: 0,
    options: ["MySQL", "PostgreSQL", "MongoDB"],
    type: "",
    value: "",
    variant: "Select",
  },
  {
    checked: true,
    description: "Choose an option.",
    disabled: false,
    label: "another select2",
    name: "another select",
    placeholder: "another select",
    required: true,
    rowIndex: 0,
    type: "",
    value: "",
    variant: "Select",
    options: ["MySQL", "PostgreSQL", "MongoDB"],
  },
  {
    checked: true,
    description: "Choose an option.",
    disabled: false,
    label: "another select3",
    name: "another select",
    placeholder: "another select",
    required: true,
    rowIndex: 0,
    type: "",
    options: ["MySQL", "PostgreSQL", "MongoDB"],
    value: "",
    variant: "Select",
  },
];

// Helper function to get the next field
function getNextField(currentFieldName) {
  const currentIndex = formStructure.findIndex(
    (field) => field.name.toLowerCase() === currentFieldName.toLowerCase()
  );
  if (currentIndex !== -1 && currentIndex + 1 < formStructure.length) {
    return formStructure[currentIndex + 1];
  }
  return null;
}

// Initial API call to get the first field options
app.get("/api/servers", (req, res) => {
  res.json({
    nextField: formStructure[0],
    selections: {},
  });
});

// API call for cascading fields
app.get("/api/*", (req, res) => {
  const path = req.params[0];
  const pathParts = path.split("/");

  let selections = {};
  let currentField = null;
  let nextFieldRequested = false;

  for (let i = 0; i < pathParts.length; i++) {
    const part = pathParts[i];

    if (part.toLowerCase() === "nextfield") {
      nextFieldRequested = true;
      continue;
    }

    if (currentField) {
      selections[currentField] = decodeURIComponent(part);
      currentField = null;
    } else {
      currentField = part;
    }
  }

  console.log("Selections:", selections);

  if (nextFieldRequested) {
    const lastSelectedField = Object.keys(selections).pop();
    const nextField = getNextField(lastSelectedField);

    if (nextField) {
      res.json({
        nextField,
        selections,
      });
    } else {
      res.status(404).json({ message: "No further fields" });
    }
  } else {
    res.status(400).json({
      message: "Invalid URL format. Missing 'nextField' in the path.",
    });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
