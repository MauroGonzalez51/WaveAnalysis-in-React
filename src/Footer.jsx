import styled from "styled-components";
import PropTypes from 'prop-types';

const InputFile = styled.input`
    padding: 1rem;
`

function Footer({ onChange }) {
    return (
        <div className="container">
            <InputFile type="file" onChange={(event) => onChange(event.target.files[0])}></InputFile>
        </div>
    );
}

Footer.propTypes = {
    onChange: PropTypes.func.isRequired,
}

export default Footer;