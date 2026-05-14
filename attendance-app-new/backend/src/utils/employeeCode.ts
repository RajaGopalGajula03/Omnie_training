export const generateEmployeeCode = (lastcode:string | null)=>{
    let nextNumber = 1;

    if(lastcode)
    {
        const numberPart = parseInt(lastcode.slice(3));

        nextNumber = numberPart + 1;
    }

    return `EMP${String(nextNumber).padStart(3,"0")}`;
}