import { MdOutlineDateRange } from "react-icons/md";
import { InputsTypes } from "@/types/inputs";
import CalendarInput from "./calendar";

export default function Inputs({
  getValue,
  name,
  title,
  placeHolder,
  options,
  value,
  min,
  max,
  error,
  type,
  extraClass,
}: InputsTypes) {
  const classes = `form-control mb-2 w-full min-h-10 border-golden border-2 ${extraClass} px-2 focus-visible:outline-1 focus-visible:outline-golden focus-visible:border-golden2`;
  return (
    <div className="form-group">
      <label htmlFor={name}>{title}</label>
      {type === "text" && (
        <input
          type={type}
          className={classes}
          placeholder={placeHolder}
          onChange={(e) => getValue(e.target.value)}
          value={value}
        />
      )}
      {type === "textarea" && (
        <textarea
          className={classes}
          placeholder={placeHolder}
          onChange={(e) => getValue(e.target.value)}
        >
          {value}
        </textarea>
      )}
      {type === "number" && (
        <input
          type={type}
          className={classes}
          placeholder={placeHolder}
          value={value}
          onChange={(e) => getValue(e.target.value)}
        />
      )}
      {type === "select" && (
        <select className={classes} onChange={(e) => getValue(e.target.value)}>
          {options?.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      )}
      {type === "date" && <CalendarInput func={getValue} />}
      {error && error != "" && (
        <>
          <p className="text-red-500">{error}</p>{" "}
        </>
      )}
    </div>
  );
}
