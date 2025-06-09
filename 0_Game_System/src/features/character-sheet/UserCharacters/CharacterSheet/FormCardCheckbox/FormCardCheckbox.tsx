import { ChangeEvent } from 'react'
import { Control, Controller, FieldPath, FieldValues } from "react-hook-form";
import { Card, CardBody } from "@nextui-org/react"

interface CheckboxItem {
  id: string;
  name: string;
  value: string;
}

interface CardWithCheckboxesProps<TFieldValues extends FieldValues = FieldValues> {
  id: string;
  label: string;
  checkboxes: CheckboxItem[];
  selectedValues?: string[];
  onSelectedValuesChange?: (newValues: string[]) => void;
  control?: Control<TFieldValues>;
  name?: FieldPath<TFieldValues>;
}

const FormCardCheckbox = <TFieldValues extends FieldValues = FieldValues>({ 
  id, 
  label, 
  checkboxes, 
  selectedValues = [], 
  onSelectedValuesChange,
  control,
  name
}: CardWithCheckboxesProps<TFieldValues>) => {

  const handleCheckboxChange = (currentValues: string[], value: string, checked: boolean) => {
    let newValues;
    if (checked) {
      newValues = [...currentValues, value];
    } else {
      newValues = currentValues.filter(item => item !== value);
    }
    
    if (onSelectedValuesChange) {
      onSelectedValuesChange(newValues);
    }
    
    return newValues;
  };

  // If using React Hook Form Controller
  if (control && name) {
    return (
      <>
        <label id={id} className="form-lbl-y col-start-1 row-start-16 md:row-start-8 col-span-2 md:col-span-5 bg-grey-lighter ">{label}</label>
        <Card className="col-start-1 col-span-2 md:col-span-5 row-span-2 ml-2 mr-2 border-1 border-black rounded-t-none" >
          <CardBody className='p-3'>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-2">
              <Controller
                name={name}
                control={control}
                render={({ field }) => (
                  <>
                    {checkboxes.map((checkbox) => (
                      <label htmlFor={checkbox.id} key={checkbox.id} className="flex items-center cursor-pointer hover:bg-gray-100 p-1 rounded" >
                        <input 
                          type='checkbox'
                          id={checkbox.id}
                          className="mr-2 w-4 h-4 accent-primary"
                          value={checkbox.value}
                          checked={Array.isArray(field.value) ? field.value.includes(checkbox.value) : false}
                          onChange={(e: ChangeEvent<HTMLInputElement>) => {
                            const currentValues = Array.isArray(field.value) ? field.value : [];
                            const newValues = handleCheckboxChange(currentValues, checkbox.value, e.target.checked);
                            field.onChange(newValues);
                          }}
                        />
                        <span className="text-sm">{checkbox.name}</span>
                      </label>
                    ))}
                  </>
                )}
              />
            </div>
          </CardBody>
        </Card>
      </>
    );
  }

  // Fallback to manual handling
  const handleManualCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    handleCheckboxChange(selectedValues, value, e.target.checked);
  };
  return (
    <>
      <label id={id} className="form-lbl-y col-start-1 row-start-16 md:row-start-8 col-span-2 md:col-span-5 bg-grey-lighter ">{label}</label>
      <Card className="col-start-1 col-span-2 md:col-span-5 row-span-2 ml-2 mr-2 border-1 border-black rounded-t-none" >
        <CardBody className='p-3'>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-2">
            {checkboxes.map((checkbox) => (
              <label htmlFor={checkbox.id} key={checkbox.id} className="flex items-center cursor-pointer hover:bg-gray-100 p-1 rounded" >
                <input 
                  type='checkbox'
                  id={checkbox.id}
                  className="mr-2 w-4 h-4 accent-primary"
                  value={checkbox.value}
                  checked={selectedValues.includes(checkbox.value)}
                  onChange={handleManualCheckboxChange}
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