import residencial from "./residencial";
import automovel from "./automovel";
import vida from "./vida";
import empresarial from "./empresarial";

const confiSeguros = {
  area: "seguros",
  marca: "Confi Seguros",

  produtos: {
    residencial,
    automovel,
    vida,
    empresarial
  }
};

export default confiSeguros;
