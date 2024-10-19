import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useCardContext } from "../context/CardContext";

const CascadingForm = () => {
  const [fields, setFields] = useState([]);
  const [selections, setSelections] = useState({});
  const [isLastField, setIsLastField] = useState(false);
  const { setCardData } = useCardContext();
  const fetchField = useCallback(
    async (url) => {
      try {
        const response = await axios.get(url);
        const newField = response.data.nextField;
        if (newField) {
          setFields((prevFields) => {
            const fieldExists = prevFields.some(
              (field) => field.name === newField.name
            );
            if (!fieldExists) {
              return [...prevFields, newField];
            }
            return prevFields;
          });
          setCardData(response.data.selections);
          setIsLastField(false);
        } else {
          setIsLastField(true);
        }
      } catch (error) {
        console.error("Error fetching field:", error);
        if (error.response && error.response.status === 404) {
          setIsLastField(true);
        }
      }
    },
    [setCardData]
  );

  useEffect(() => {
    fetchField("http://localhost:8000/api/servers");
  }, [fetchField]);

  const generateUrl = useCallback((selections) => {
    const keys = Object.keys(selections);
    let url = "http://localhost:8000/api/";
    keys.forEach((key, index) => {
      const cleanedKey = encodeURIComponent(key.trim());
      const cleanedValue = encodeURIComponent(selections[key].trim());
      url += `${cleanedKey}/${cleanedValue}`;
      if (index < keys.length - 1 || index === keys.length - 1) {
        url += "/nextField/";
      }
    });
    return url;
  }, []);

  const handleSelectionChange = useCallback(
    (fieldName, selectedValue) => {
      setSelections((prevSelections) => {
        const updatedSelections = {
          ...prevSelections,
          [fieldName]: selectedValue,
        };
        const url = generateUrl(updatedSelections);
        fetchField(url);
        return updatedSelections;
      });
    },
    [fetchField, generateUrl]
  );

  const renderField = useCallback(
    (field) => {
      if (field?.variant === "Select") {
        return (
          <div key={field.name} className="flex space-x-5 w-full">
            <label>{field.label}</label>
            <select
              value={selections[field.name] || ""}
              onChange={(e) =>
                handleSelectionChange(field.name, e.target.value)
              }
              className="outline-none border-2 border-gray-300 rounded-md p-1"
              required={field.required}
              disabled={field.disabled}
            >
              <option value="">{field.placeholder}</option>
              {field.options &&
                field.options.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
            </select>
          </div>
        );
      }
      if (field?.variant === "Input") {
        return (
          <div key={field.name} className="flex space-x-5 w-full">
            <label>{field.label}</label>
            <input
              type={field.type}
              value={selections[field.name] || ""}
              onChange={(e) =>
                handleSelectionChange(field.name, e.target.value)
              }
              className="outline-none border-2 border-gray-300 rounded-md p-1 w-40"
              placeholder={field.placeholder}
              required={field.required}
              disabled={field.disabled}
            />
          </div>
        );
      }
      return null;
    },
    [selections, handleSelectionChange]
  );

  return (
    <form className="h-full w-fit bg-white shadow-xl p-5 overflow-x-hidden space-y-5">
      {fields.map((field) => (
        <div key={field.name} className="border-b-2">
          {renderField(field)}
        </div>
      ))}
      {isLastField && (
        <div className="text-green-600 font-semibold">
          No more fields available.
        </div>
      )}
    </form>
  );
};

export default CascadingForm;
