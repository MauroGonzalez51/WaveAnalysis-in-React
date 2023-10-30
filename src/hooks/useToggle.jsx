import { useState } from "react";

const useToggle = (initialValue = false) => {
    const [value, setValue] = useState(initialValue);
    const toggle = () => setValue((x) => !x);
    return [value, toggle, setValue];
}

export { useToggle };
