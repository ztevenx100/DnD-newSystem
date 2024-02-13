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
  {/* peer relative appearance-none w-5 h-5 border border-blue-gray-200 cursor-pointer transition-all before:content[''] before:block before:bg-blue-gray-500 before:w-12 before:h-12 before:absolute before:top-2/4 before:left-2/4 before:-translate-y-2/4 before:-translate-x-2/4 before:opacity-0 before:transition-opacity checked:bg-red-500 checked:border-red-500 checked:before:bg-red-500 hover:before:opacity-0 form-checkbox*/}

  return (
    <>

      <label id={id} className="form-lbl-y col-start-1 md:row-start-6 col-span-2 md:col-span-4 bg-grey-lighter ">{label}</label>
      <Card className="flex flex-row flex-wrap justify-around col-start-1 col-span-2 md:col-span-4 row-span-2 ml-2 mr-2 border-1 border-black rounded-t-none" placeholder = ''>

          {checkboxes.map((checkbox) => (
          <List className="flex-row" key={checkbox.id} placeholder = ''>
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