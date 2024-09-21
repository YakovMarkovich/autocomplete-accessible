import React, { useState, useRef } from "react";
import "./AutocompleteCustom.css"; 

const AutocompleteCustom = ({ allOptions }) => {
  const [inputValue, setInputValue] = useState("");
  const [tempValue, setTempValue] = useState("");
  const [filteredOptions, setFilteredOptions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [activeOptionIndex, setActiveOptionIndex] = useState(-1);
  const inputRef = useRef(null);
  const listBoxRef = useRef(null);

  React.useEffect(() => {
    if (listBoxRef?.current) {
      listBoxRef.current.style.display = showDropdown ? "block" : "none";
    }
  }, [showDropdown]);

  React.useEffect(() => {
    if (inputRef?.current) {
      inputRef?.current?.setSelectionRange(tempValue.length, inputValue.length);
    }
  }, [tempValue,inputValue]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setTempValue(value);
    const filtered = allOptions.filter((option) =>
      option.value.toLowerCase().startsWith(value.toLowerCase())
    );
    setFilteredOptions(filtered);
    setShowDropdown(filtered.length > 0);
    setActiveOptionIndex(-1);
    if (filtered.length > 0) {
      if (tempValue.includes(value)) {
        setInputValue(filtered[0].value);
        inputRef.current.value = value;
        return;
      }
      const suggestion = filtered[0].value;
      setInputValue(suggestion);
      inputRef.current.value = suggestion;
    } else {
      setInputValue(value);
      inputRef.current.value = value;
    }
  };

  const handleOptionClick = (option) => {
    setInputValue(option.value);
    inputRef.current.value = option.value;
    setShowDropdown(false);
  };

  const handleFocus = () => {
    if (inputValue === "") {
      setFilteredOptions(allOptions);
      setShowDropdown(true);
    }
  };

  const handleToggleDropdown = () => {
    if (!showDropdown) {
      setFilteredOptions(allOptions);
      setShowDropdown(true);
      inputRef.current.focus();
    } else {
      setShowDropdown(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      setActiveOptionIndex((prevIndex) => {
        const newIndex = (prevIndex + 1) % filteredOptions.length;
        setInputValue(filteredOptions[newIndex].value);
        inputRef.current.value = filteredOptions[newIndex].value;
        return newIndex;
      });
    } else if (e.key === "ArrowUp") {
      setActiveOptionIndex((prevIndex) => {
        const newIndex =
          (prevIndex - 1 + filteredOptions.length) % filteredOptions.length;
        setInputValue(filteredOptions[newIndex].value);
        inputRef.current.value = filteredOptions[newIndex].value;
        return newIndex;
      });
    } else if (e.key === "Enter" && activeOptionIndex >= 0) {
      handleOptionClick(filteredOptions[activeOptionIndex]);
    }
  };

  const handleBlur = () => {
    if (inputRef.current) {
      inputRef.current.setSelectionRange(inputValue.length, inputValue.length);
    }
    setShowDropdown(false)
  };

  return (
    <div className="combobox combobox-list">
      <div className="group">
        <input
          type="text"
          role="combobox"
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          onBlur={handleBlur}
          ref={inputRef}
          aria-autocomplete="both"
          aria-controls="autocomplete-list"
          aria-expanded={showDropdown}
          aria-activedescendant={
            activeOptionIndex >= 0 ? filteredOptions[activeOptionIndex].id : ""
          }
        />
        <button onClick={handleToggleDropdown} aria-label="Toggle dropdown" aria-expanded={showDropdown} tabIndex={-1}>
          <svg
              width="18"
              height="16"
              aria-hidden="true"
              focusable="false"
              styles={"forced-color-adjust: auto"}
            >
              <polygon
                class="arrow"
                stroke-width="0"
                fill-opacity="0.75"
                fill="currentcolor"
                points="3,6 15,6 9,14"
              ></polygon>
            </svg>
        </button>
      </div>
      {showDropdown && (
        <ul id="autocomplete-list" role="listbox" ref={listBoxRef}>
          {filteredOptions.map((option, index) => (
            <li
              key={option.id}
              id={option.id}
              value={option.value}
              onClick={() => handleOptionClick(option)}
              className={index === activeOptionIndex ? "active" : ""}
              role="option"
              aria-selected={index === activeOptionIndex}
            >
              {option.value}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
export default AutocompleteCustom;
