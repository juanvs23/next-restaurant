import styled from "styled-components";
import Menu from "./menu";

const Nav = styled.nav`
  ul {
    display: flex;
    align-items: center;
  }
  @media (max-width: 991px) {
    display: none;
  }
`;

export default function MenuNav() {
  return (
    <Nav>
      <Menu />
    </Nav>
  );
}
