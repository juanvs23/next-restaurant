import Inputs from "@/components/frontend/components/formComponents/inputs";

export default function DatingInfo() {
    return(
        <>
          <div className="flex flex-col gap-2 md:flex-row">
          <div className="w-full md:w-6/12">
            <Inputs getValue={(value: string) => console.log(value)} name="dateTime" title="Reservation date" placeHolder={`${Date.now()}`} type="date" />
          </div>
          <div className="w-full form-group md:w-6/12">
            <Inputs getValue={(value: string) => console.log(value)} name="turnTime" title="Reservation time" type="select" options={[
              { value: 'morning', label: 'Morning' },
              { value: 'afternoon', label: 'Afternoon' },
              { value: 'evening', label: 'Evening' },
            ]} />
          </div>

        </div>
        </>
    )
}