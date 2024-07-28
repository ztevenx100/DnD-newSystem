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
    if (e.target.checked) {
      onSelectedValuesChange([...selectedValues, value]);
    } else {
      onSelectedValuesChange(selectedValues.filter(item => item !== value));
    }
  };

  return (
    <>

      <label id={id} className="form-lbl-y col-start-1 row-start-16 md:row-start-8 col-span-2 md:col-span-5 bg-grey-lighter ">{label}</label>
      <Card className="flex flex-row flex-wrap justify-around col-start-1 col-span-2 md:col-span-5 row-span-2 ml-2 mr-2 border-1 border-black rounded-t-none" >
        <CardBody className='flex-row min-w-10 p-2 gap-x-4'>
          {checkboxes.map((checkbox) => (
              <label htmlFor={checkbox.id} key={checkbox.id} className="flex w-full cursor-pointer items-center " >
                <input 
                  type='checkbox'
                  id={checkbox.id}
                  className="p-0 mr-2"
                  value={checkbox.value}
                  checked={selectedValues.includes(checkbox.value)}
                  onChange={handleCheckboxChange}
                />
                {checkbox.name}
              </label>
          ))}
        </CardBody>

      </Card>
      
    </>
  );
};

export default FormCardCheckbox;