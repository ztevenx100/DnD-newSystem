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
        <label id={id} className="form-lbl-y col-start-1 md:row-start-6 col-span-2 md:col-span-4 bg-grey-lighter ">{label}</label>
        <Card className="flex flex-row flex-wrap flex justify-around col-start-1 col-span-2 md:col-span-4 row-span-2 ml-2 mr-2 border-1 border-black">

            {checkboxes.map((checkbox) => (
            <List className="flex-row" key={checkbox.id}>
            <ListItem className="p-0">
                <label htmlFor={checkbox.id} className="flex w-full cursor-pointer items-center " >
                    <ListItemPrefix className="mr-2">
                        <Checkbox 
                            id={checkbox.id} 
                            ripple={false} 
                            className="hover:before:opacity-0" 
                            crossOrigin="" 
                            checked={selectedValues.includes(checkbox.value)}
                            onChange={handleCheckboxChange}
                            value={checkbox.value}
                        />
                    </ListItemPrefix>
                    <Typography color="blue-gray" className="font-medium mr-2">{checkbox.name}</Typography>
                </label>
            </ListItem>
            </List>
            ))}

        </Card>
    </>
  );
};

export default FormCardCheckbox;