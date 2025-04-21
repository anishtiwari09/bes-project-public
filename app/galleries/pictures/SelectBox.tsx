"use client";
import { FormControl, MenuItem, Select } from "@mui/material";
import  { useEffect, useRef, useState } from "react";

export default function SelectBox({
  allImagePath,
  selectedValue
}: any) {
  const [state, setState] = useState(selectedValue?.value);
  const [isSubmit, setIsSubmit] = useState(false);
  const ref = useRef<HTMLButtonElement>(null);
  const handleChange = (event: any) => {
    setState(event.target.value);
    setIsSubmit(true);
  };
  useEffect(() => {
    if (isSubmit && ref.current) {
 
      ref.current.click();
    }
  }, [isSubmit]);
  return (
    <form className="flex w-[300px] gap-2 items-center" method="GET">
      <label>Select Year:</label>
      <FormControl className="flex-1" fullWidth>
        <Select value={state} onChange={handleChange} name="selectedValue">
          {allImagePath.map((image: any, index: any) => (
            <MenuItem value={image.value} key={index}>
              {image.name}{" "}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <button className="hidden" ref={ref} type="submit"></button>
    </form>
  );
}
