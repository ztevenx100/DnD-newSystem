import React, { ChangeEvent } from 'react'

import { Card, CardBody } from "@nextui-org/react"

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
    console.log(`Checkbox ${value} changed to: ${e.target.checked}`);
    if (e.target.checked) {
      onSelectedValuesChange([...selectedValues, value]);
    } else {
      onSelectedValuesChange(selectedValues.filter(item => item !== value));
    }
  };

  return (
    <>      <label id={id} className="form-lbl-y col-start-1 row-start-16 md:row-start-8 col-span-2 md:col-span-5 bg-grey-lighter ">{label}</label>
      <Card className="col-start-1 col-span-2 md:col-span-5 row-span-2 ml-2 mr-2 border-1 border-black rounded-t-none" >
        <CardBody className='p-3'>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {checkboxes.map((checkbox) => (
              <label htmlFor={checkbox.id} key={checkbox.id} className="flex items-center cursor-pointer hover:bg-gray-100 p-1 rounded" >
                <input 
                  type='checkbox'
                  id={checkbox.id}
                  className="mr-2 w-4 h-4 accent-primary"
                  value={checkbox.value}
                  checked={selectedValues.includes(checkbox.value)}
                  onChange={handleCheckboxChange}
                />
                <span className="text-sm">{checkbox.name}</span>
              </label>
            ))}
          </div>
        </CardBody>
      </Card>
      
    </>
  );
};

export default FormCardCheckbox;