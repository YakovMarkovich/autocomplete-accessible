import React, { useRef, useState, useEffect } from "react";
import styles from "./Autocomplete.module.css";

function Autocomplete({ allOptions, ariaAutocomplete }) {
  const [filteredOptions, setFilteredOptions] = useState([]);
  const [filter, setFilter] = useState("");
  const [currentOption, setCurrentOption] = useState(null);
  const [firstOption, setFirstOption] = useState(null);
  const [lastOption, setLastOption] = useState(null);
  const [isListboxVisible, setIsListboxVisible] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [visualFocus, setVisualFocus] = useState(false);
  const comboboxRef = useRef(null);
  const listboxRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    filterOptions();
  }, [filter, allOptions]);

  useEffect(() => {
    if (isListboxVisible && listboxRef?.current) {
      listboxRef.current.style.display = "block";
    } else if (listboxRef.current) {
      listboxRef.current.style.display = "none";
    }
  }, [isListboxVisible]);

  const handleInputClick = (event) => {
    if (isListboxVisible) {
      closeListbox(true);
    } else {
      openListbox();
    }
  };

  const openListbox = () => {
    if (listboxRef.current) {
      listboxRef.current.style.display = "block";
    }
    if (comboboxRef.current) {
      comboboxRef.current.setAttribute("aria-expanded", "true");
    }
    if (buttonRef.current) {
      buttonRef.current.setAttribute("aria-expanded", "true");
    }
  };

  const closeListbox = (force = false) => {
    if (
      force ||
      (!comboboxRef.current.contains(document.activeElement) &&
        !listboxRef.current.contains(document.activeElement) &&
        !buttonRef.current.contains(document.activeElement))
    ) {
      setIsListboxVisible(false);
      if (comboboxRef.current) {
        comboboxRef.current.setAttribute("aria-expanded", "false");
      }
      if (buttonRef.current) {
        buttonRef.current.setAttribute("aria-expanded", "false");
      }
      setCurrentOptionStyle(false);
      setActiveDescendant(false);
    }
  };

  const handleComboboxFocus = () => {
    setFilter(comboboxRef.current.value);
    filterOptions();
    setVisualFocusCombobox();
    setCurrentOption(null);
    setCurrentOptionStyle(null);
  };

  //TODO
  const setCurrentOptionStyle = (option) => {
    // filteredOptions.forEach((opt) => {
    //   if (opt === option) {
    //     opt.setAttribute("aria-selected", "true");
    //     if (
    //       listboxRef.current.scrollTop + listboxRef.current.offsetHeight <
    //       opt.offsetTop + opt.offsetHeight
    //     ) {
    //       listboxRef.current.scrollTop =
    //         opt.offsetTop + opt.offsetHeight - listboxRef.current.offsetHeight;
    //     } else if (listboxRef.current.scrollTop > opt.offsetTop + 2) {
    //       listboxRef.current.scrollTop = opt.offsetTop;
    //     }
    //   } else {
    //     opt.removeAttribute("aria-selected");
    //   }
    // });
  };
  const setActiveDescendant = (option) => {};
  const setVisualFocusCombobox = () => {
    if (listboxRef?.current) {
      listboxRef.current.classList.remove("focus");
    }
    comboboxRef.current.parentNode.classList.add("focus"); // set the focus class to the parent for easier styling
    comboboxRef.current.focus();
    // if (listboxRef.current) {
    //   listboxRef.current.blur();
    // }
    setIsListboxVisible(false);
    setActiveDescendant(false);
  };
  const setVisualFocusListbox = () => {
    comboboxRef.current.parentNode.classList.remove("focus");
    comboboxRef.current.blur();
    listboxRef?.current?.focus();
    listboxRef?.current?.classList.add("focus");
    setIsListboxVisible(true)
    setActiveDescendant(currentOption);

  };

  // ? Check if need this event
  const handleInputChange = (event) => {
    setFilter(event.target.value);
    setIsListboxVisible(true);
  };

  const handleOptionClick = (option) => {
    setFilter(option.value);
    setIsListboxVisible(false);
  };

  const isPrintableCharacter = (str) => {
    return str.length === 1 && str.match(/\S/);
  };

  const onComboboxKeyUp = (event) => {
    let flag = false;
    let char = event.key;

    if (isPrintableCharacter(char)) {
      setFilter((prevFilter) => prevFilter + char);
    }

    if (comboboxRef.current.value.length < filter.length) {
      setFilter(comboboxRef.current.value);
      setCurrentOption(null);
      filterOptions();
    }

    if (event.key === 'Escape' || event.key === 'Esc') {
      return;
    }

    switch (event.key) {
      case 'Backspace':
        setVisualFocusCombobox();
        setCurrentOptionStyle(false);
        setFilter(comboboxRef.current.value);
        setCurrentOption(null);
        filterOptions();
        flag = true;
        break;

      case 'ArrowLeft':
      case 'ArrowRight':
      case 'Home':
      case 'End':
        setFilter(comboboxRef.current.value);
        setCurrentOption(null);
        setCurrentOptionStyle(false);
        setVisualFocusCombobox();
        flag = true;
        break;

      default:
        if (isPrintableCharacter(char)) {
          setVisualFocusCombobox();
          setCurrentOptionStyle(false);
          flag = true;

          if (currentOption) {
            if (!isListboxVisible && comboboxRef.current.value.length) {
              openListbox();
            }

            if (getLowercaseContent(currentOption).indexOf(comboboxRef.current.value.toLowerCase()) === 0) {
              setCurrentOption(currentOption);
              setCurrentOptionStyle(currentOption);
            } else {
              setCurrentOption(null);
              setCurrentOptionStyle(false);
            }
          } else {
            closeListbox();
            setCurrentOption(null);
          }
        }
        break;
    }

    if (flag) {
      event.stopPropagation();
      event.preventDefault();
    }
  };

  const onComboboxKeyDown = (event) => {
    event.preventDefault();
    let flag = false;
    const altKey = event.altKey;

    if (event.ctrlKey || event.shiftKey) {
      return;
    }

    switch (event.key) {
      case "Enter":
        if (document.activeElement === listboxRef.current) {
          setValue(currentOption.value);
        }
        closeListbox(true);
        setVisualFocusCombobox();
        flag = true;
        break;

      case "ArrowDown":
        if (filteredOptions.length > 0) {
          if (altKey) {
            openListbox();
          } else {
            openListbox();
            if (
              document.activeElement === listboxRef.current ||
              (ariaAutocomplete === "both" && filteredOptions.length > 1)
            ) {
              setCurrentOption(getNextOption(currentOption), true);
              setVisualFocusListbox();
            } else {
              setCurrentOption(filteredOptions[0], true);
              setVisualFocusListbox();
            }
          }
        }
        flag = true;
        break;
      case "ArrowUp":
        if (filteredOptions.length) {
          if (document.activeElement === listboxRef.current) {
            setCurrentOption(getPreviousOption(currentOption), true);
          } else {
            openListbox();
            if (!altKey) {
              setCurrentOption(
                filteredOptions[filteredOptions.length - 1],
                true
              );
              setVisualFocusListbox();
            }
          }
        }
        flag = true;
        break;

      case "Escape":
        if (listboxRef?.current?.style.display === 'block') {
          closeListbox(true);
          setFilter(comboboxRef.current.value);
          filterOptions();
          setVisualFocusCombobox();
        } else {
          setValue("");
          comboboxRef.current.value = "";
        }
        setCurrentOption(null);
        flag = true;
        break;

      case "Tab":
        closeListbox(true);
        if (document.activeElement === listboxRef.current && currentOption) {
          setValue(currentOption.value);
        }
        break;

      case "Home":
        comboboxRef.current.setSelectionRange(0, 0);
        flag = true;
        break;

      case "End":
        const length = comboboxRef.current.value.length;
        comboboxRef.current.setSelectionRange(length, length);
        flag = true;
        break;

      default:
        break;
    }

    if (flag) {
      event.stopPropagation();
      event.preventDefault();
    }
  };

  const getPreviousOption = (currentOption) => {
    if (currentOption !== firstOption) {
      const index = filteredOptions.indexOf(currentOption);
      return filteredOptions[index - 1];
    }
    return lastOption;
  };

  const getNextOption = (currentOption) => {
    if (currentOption !== lastOption) {
      const index = filteredOptions.indexOf(currentOption);
      return filteredOptions[index + 1];
    }
    return firstOption;
  };

  const setValue = (value) => {
    setFilter(value);
    comboboxRef.current.value = filter;
    comboboxRef.current.setSelectionRange(filter.length, filter.length);
    filterOptions();
  };

  const getLowercaseContent = (option) => {
    return option.value.toLowerCase();
  };

  const filterOptions = () => {
    if (ariaAutocomplete === "isNone") {
      setFilter("");
    }
    const lowerCaseFilter = filter.toLowerCase();
    const newFilteredOptions = allOptions.filter(
      (opt) =>
        lowerCaseFilter.length === 0 ||
        getLowercaseContent(opt).indexOf(lowerCaseFilter) === 0
    );

    setFilteredOptions(newFilteredOptions);

    if (newFilteredOptions.length > 0) {
      setFirstOption(newFilteredOptions[0]);
      setLastOption(newFilteredOptions[newFilteredOptions.length - 1]);

      if (currentOption && newFilteredOptions.includes(currentOption)) {
        setCurrentOption(currentOption);
      } else {
        setCurrentOption(newFilteredOptions[0]);
      }
    } else {
      setFirstOption(null);
      setLastOption(null);
      setCurrentOption(null);
    }
  };

  return (
    <>
      <label htmlFor="cb1-input">State</label>
      <div className={`${styles.combobox} ${styles.comboboxList}`}>
        <div className={styles.group}>
          <input
            id="cb1-input"
            className="cb_edit"
            type="text"
            value={filter}
            onChange={handleInputChange}
            onClick={handleInputClick}
            onFocus={handleComboboxFocus}
            // onKeyDown={onComboboxKeyDown}
            //onKeyUp={onComboboxKeyUp}
            ref={comboboxRef}
            role="combobox"
            autoComplete="off"
            aria-autocomplete={ariaAutocomplete}
            aria-expanded={isListboxVisible}
            aria-controls="cb1-listbox"
          />
          <button
            type="button"
            id="cb1-button"
            aria-label="States"
            aria-expanded={isListboxVisible}
            aria-controls="cb1-listbox"
            ref={buttonRef}
            tabIndex="-1"
            onClick={() => setIsListboxVisible(!isListboxVisible)}
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
        {isListboxVisible && (
          <ul
            id="cb1-listbox"
            role="listbox"
            aria-label="States"
            ref={listboxRef}
          >
            {filteredOptions.map((option) => (
              <li
                key={option.id}
                value={option.value}
                onClick={() => handleOptionClick(option)}
                role="option"
              >
                {option.value}
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}

export default Autocomplete;
