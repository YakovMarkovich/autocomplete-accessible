//import Autocomplete from "./components/Autocomplete/autocomplete";
import AutocompleteCustom from "./components/AutoCompleteCustom/AutocompleteCustom";
function App() {

  const states = [
    { id: 'lb1-al', value: 'Alabama' },
    { id: 'lb1-ak', value: 'Alaska' },
    { id: 'lb1-as', value: 'American Samoa' },
    { id: 'lb1-az', value: 'Arizona' },
    { id: 'lb1-ar', value: 'Arkansas' },
    { id: 'lb1-ca', value: 'California' },
    { id: 'lb1-co', value: 'Colorado' },
    { id: 'lb1-ct', value: 'Connecticut' },
    { id: 'lb1-de', value: 'Delaware' },
    { id: 'lb1-dc', value: 'District of Columbia' },
    { id: 'lb1-fl', value: 'Florida' },
    { id: 'lb1-ga', value: 'Georgia' },
    { id: 'lb1-gm', value: 'Guam' },
    { id: 'lb1-hi', value: 'Hawaii' },
    { id: 'lb1-id', value: 'Idaho' },
    { id: 'lb1-il', value: 'Illinois' },
    { id: 'lb1-in', value: 'Indiana' },
    { id: 'lb1-ia', value: 'Iowa' },
    { id: 'lb1-ks', value: 'Kansas' },
    { id: 'lb1-ky', value: 'Kentucky' },
    { id: 'lb1-la', value: 'Louisiana' },
    { id: 'lb1-me', value: 'Maine' },
    { id: 'lb1-md', value: 'Maryland' },
    { id: 'lb1-ma', value: 'Massachusetts' },
    { id: 'lb1-mi', value: 'Michigan' },
    { id: 'lb1-mn', value: 'Minnesota' },
    { id: 'lb1-ms', value: 'Mississippi' },
    { id: 'lb1-mo', value: 'Missouri' },
    { id: 'lb1-mt', value: 'Montana' },
    { id: 'lb1-ne', value: 'Nebraska' },
    { id: 'lb1-nv', value: 'Nevada' },
    { id: 'lb1-nh', value: 'New Hampshire' },
    { id: 'lb1-nj', value: 'New Jersey' },
    { id: 'lb1-nm', value: 'New Mexico' },
    { id: 'lb1-ny', value: 'New York' },
    { id: 'lb1-nc', value: 'North Carolina' },
    { id: 'lb1-nd', value: 'North Dakota' },
    { id: 'lb1-mp', value: 'Northern Marianas Islands' },
    { id: 'lb1-oh', value: 'Ohio' },
    { id: 'lb1-ok', value: 'Oklahoma' },
    { id: 'lb1-or', value: 'Oregon' },
    { id: 'lb1-pa', value: 'Pennsylvania' },
    { id: 'lb1-pr', value: 'Puerto Rico' },
    { id: 'lb1-ri', value: 'Rhode Island' },
    { id: 'lb1-sc', value: 'South Carolina' },
    { id: 'lb1-sd', value: 'South Dakota' },
    { id: 'lb1-tn', value: 'Tennessee' },
    { id: 'lb1-tx', value: 'Texas' },
    { id: 'lb1-ut', value: 'Utah' },
    { id: 'lb1-ve', value: 'Vermont' },
    { id: 'lb1-va', value: 'Virginia' },
    { id: 'lb1-vi', value: 'Virgin Islands' },
    { id: 'lb1-wa', value: 'Washington' },
    { id: 'lb1-wv', value: 'West Virginia' },
    { id: 'lb1-wi', value: 'Wisconsin' },
    { id: 'lb1-wy', value: 'Wyoming' }
  ];
  

  return (
    <>
    {/* <Autocomplete allOptions={states} ariaAutocomplete={"both"}/> */}
    <AutocompleteCustom allOptions={states}/>
    </>
  );
}

export default App;
