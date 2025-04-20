import { Button as FlowbiteBtn } from "flowbite-react";


const Button = ({ disabled, loading, textContent, ...props }) => {
    return (
        <FlowbiteBtn disabled={disabled} {...props} style={{ cursor: "pointer" }}>
            {loading ? "Loading..." : textContent}
        </FlowbiteBtn>
    )
}

export default Button