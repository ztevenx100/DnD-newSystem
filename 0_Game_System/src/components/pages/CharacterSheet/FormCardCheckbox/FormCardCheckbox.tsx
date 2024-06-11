import React, { ChangeEvent } from 'react';
import { Checkbox, Card, List, ListItem, ListItemPrefix, Typography } from "@material-tailwind/react";

interface CheckboxItem {
  id: string;
  name: string;
  value: string;
}

interface CardWithCheckboxesProps {
  id: string;
  label: string;
  checkboxes: CheckboxItem[];
  selectedValues: string[];
  onSelectedValuesChange: (newValues: string[]) => void;
}

const FormCardCheckbox: React.FC<CardWithCheckboxesProps> = ({ id, label, checkboxes, selectedValues, onSelectedValuesChange }) => {

  const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (e.target.checked) {
      onSelectedValuesChange([...selectedValues, value]);
    } else {
      onSelectedValuesChange(selectedValues.filter(item => item !== value));
    }
  };

  return (
    <>

      <label id={id} className="form-lbl-y col-start-1 row-start-14 md:row-start-8 col-span-2 md:col-span-5 bg-grey-lighter ">{label}</label>
      <Card className="flex flex-row flex-wrap justify-around col-start-1 col-span-2 md:col-span-5 row-span-2 ml-2 mr-2 border-1 border-black rounded-t-none" placeholder = ''>

          {checkboxes.map((checkbox) => (
          <List className="flex-row min-w-10 p-0" key={checkbox.id} placeholder = ''>
          <ListItem className="p-0" placeholder = '' >
              <label htmlFor={checkbox.id} className="flex w-full cursor-pointer items-center " >
                  <ListItemPrefix className="mr-2" placeholder = ''>
                      <Checkbox 
                          id={checkbox.id}
                          ripple={false}
                          className="hover:before:opacity-0 form-checkbox"
                          crossOrigin=""
                          checked={selectedValues.includes(checkbox.value)}
                          onChange={handleCheckboxChange}
                          value={checkbox.value}
                      />
                  </ListItemPrefix>
                  <Typography color="black" className="font-medium mr-2" placeholder = ''>{checkbox.name}</Typography>
              </label>
          </ListItem>
          </List>
          ))}

      </Card>
      
    </>
  );
};

export default FormCardCheckbox;