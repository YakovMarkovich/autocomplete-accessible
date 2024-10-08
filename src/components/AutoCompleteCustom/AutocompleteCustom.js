import React, { useState, useRef } from "react";
import "./AutocompleteCustom.css";

const AutocompleteCustom = ({ allOptions, label }) => {
  const [currentOption, setCurrentOption] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [filteredOptions, setFilteredOptions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [activeOptionIndex, setActiveOptionIndex] = useState(-1);
  const inputRef = useRef(null);
  const listBoxRef = useRef(null);
  const containerRef = useRef(null);

  React.useEffect(() => {
    if (inputRef?.current) {
      inputRef?.current?.setSelectionRange(
        inputValue.length,
        currentOption.length
      );
    }
  }, [inputValue, currentOption]);

  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    const filtered = allOptions.filter((option) =>
      option.value.toLowerCase().startsWith(value.toLowerCase())
    );
    setFilteredOptions(filtered);
    setShowDropdown(filtered.length > 0);
    setActiveOptionIndex(-1);
    if (filtered.length > 0) {
      if (inputValue.includes(value)) {
        setCurrentOption(filtered[0].value);
        inputRef.current.value = value;
        return;
      }
      const suggestion = filtered[0].value;
      setCurrentOption(suggestion);
      inputRef.current.value = suggestion;
    } else {
      setCurrentOption(value);
      inputRef.current.value = value;
    }
  };

  const handleOptionClick = (option) => {
    setInputValue(option.value);
    inputRef.current.value = option.value;
    setShowDropdown(false);
  };

  const handleFocus = () => {
    if (currentOption === "") {
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
        setCurrentOption(filteredOptions[newIndex].value);
        inputRef.current.value = filteredOptions[newIndex].value;
        setCurrentOptionStyle(filteredOptions[newIndex].value);
        return newIndex;
      });
    } else if (e.key === "ArrowUp") {
      setActiveOptionIndex((prevIndex) => {
        const newIndex =
          (prevIndex - 1 + filteredOptions.length) % filteredOptions.length;
        setCurrentOption(filteredOptions[newIndex].value);
        inputRef.current.value = filteredOptions[newIndex].value;
        setCurrentOptionStyle(filteredOptions[newIndex].value);
        setTimeout(() => {
          inputRef.current.setSelectionRange(
            filteredOptions[newIndex].value.length,
            filteredOptions[newIndex].value.length
          );
        }, 0);
        return newIndex;
      });
    } else if (e.key === "Enter" && activeOptionIndex >= 0) {
      handleOptionClick(filteredOptions[activeOptionIndex]);
    } else if (e.key === "Escape") {
      if (showDropdown) {
        setShowDropdown(false);
      } else {
        setCurrentOption("");
        inputRef.current.value = "";
      }
    }
  };

  const setCurrentOptionStyle = (option) => {
    filteredOptions.forEach((opt) => {
      const optAsNode = document.getElementById(opt.id);
      if (opt.value === option) {
        if (
          listBoxRef &&
          listBoxRef.current &&
          listBoxRef.current.scrollTop + listBoxRef.current.offsetHeight <
            optAsNode.offsetTop + optAsNode.offsetHeight
        ) {
          listBoxRef.current.scrollTop =
            optAsNode.offsetTop +
            optAsNode.offsetHeight -
            listBoxRef.current.offsetHeight;
        } else if (
          listBoxRef &&
          listBoxRef.current &&
          listBoxRef.current.scrollTop > optAsNode.offsetTop + 2
        ) {
          listBoxRef.current.scrollTop = opt.offsetTop;
        }
      }
    });
  };

  return (
    <>
      <label htmlFor="cb1-input">{label}</label>
      <div className="combobox combobox-list" ref={containerRef}>
        <div className="group">
          <input
            id="cb1-input"
            type="text"
            role="combobox"
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={handleFocus}
            ref={inputRef}
            aria-autocomplete="both"
            aria-controls="autocomplete-list"
            aria-expanded={showDropdown}
            aria-activedescendant={
              activeOptionIndex >= 0
                ? filteredOptions[activeOptionIndex].id
                : ""
            }
          />
          <button
            onClick={handleToggleDropdown}
            aria-label="Toggle dropdown"
            aria-expanded={showDropdown}
            tabIndex={-1}
          >
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
    </>
  );
};
export default AutocompleteCustom;
