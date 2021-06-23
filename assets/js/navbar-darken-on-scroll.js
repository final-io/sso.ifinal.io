import utils from "./utils";

/* -------------------------------------------------------------------------- */
/*                         Navbar Darken on scroll                        */
/* -------------------------------------------------------------------------- */
const navbarDarkenOnScroll = () => {
  const Selector = {
    NAVBAR: "[data-navbar-darken-on-scroll]",
    NAVBAR_COLLAPSE: ".navbar-collapse",
    NAVBAR_TOGGLER: ".navbar-toggler",
  };

  const ClassNames = {
    COLLAPSED: "collapsed",
  };

  const Events = {
    SCROLL: "scroll",
    SHOW_BS_COLLAPSE: "show.bs.collapse",
    HIDE_BS_COLLAPSE: "hide.bs.collapse",
    HIDDEN_BS_COLLAPSE: "hidden.bs.collapse",
  };

  const DataKey = {
    NAVBAR_DARKEN_ON_SCROLL: "navbar-darken-on-scroll",
  };

  const navbar = document.querySelector(Selector.NAVBAR);

  const toggleThemeClass = (theme) => {
    if (theme === "dark") {
      navbar.classList.remove("navbar-dark");
      navbar.classList.add("navbar-light");
    } else {
      navbar.classList.remove("navbar-light");
      navbar.classList.add("navbar-dark");
    }
  }
  
  if (navbar) {
    const theme = localStorage.getItem("theme");
    toggleThemeClass(theme)

    const themeController = document.body;
    themeController.addEventListener(
      "clickControl",
      ({ detail: { control,value } }) => {
        if (control === "theme") {
          toggleThemeClass(value)
        }
      }
    );


    const defaultColorName = theme === "dark" ? "100" : "dark";

    const parent = document.documentElement;
    const windowHeight = window.innerHeight;
    const html = document.documentElement;
    const navbarCollapse = navbar.querySelector(Selector.NAVBAR_COLLAPSE);

    const allColors = { ...utils.getColors(parent), ...utils.getGrays(parent) };
    const name = utils.getData(navbar, DataKey.NAVBAR_DARKEN_ON_SCROLL);
    const colorName = Object.keys(allColors).includes(name)
      ? name
      : defaultColorName;
    const color = allColors[colorName];
    const bgClassName = `bg-${colorName}`;
    const colorRgb = utils.hexToRgb(color);
    const { backgroundImage } = window.getComputedStyle(navbar);
    const transition = "background-color 0.35s ease";

    navbar.style.backgroundImage = "none";
    // Change navbar background color on scroll
    window.addEventListener(Events.SCROLL, () => {
      const { scrollTop } = html;
      let alpha = (scrollTop / windowHeight) * 2;
      alpha >= 1 && (alpha = 1);
      navbar.style.backgroundColor = `rgba(${colorRgb[0]}, ${colorRgb[1]}, ${colorRgb[2]}, ${alpha})`;
      navbar.style.backgroundImage =
        alpha > 0 || utils.hasClass(navbarCollapse, "show")
          ? backgroundImage
          : "none";
    });

    // Toggle bg class on window resize
    utils.resize(() => {
      const breakPoint = utils.getBreakpoint(navbar);
      if (window.innerWidth > breakPoint) {
        navbar.classList.remove(bgClassName);
        navbar.style.backgroundImage = html.scrollTop
          ? backgroundImage
          : "none";
        navbar.style.transition = "none";
      } else if (
        !utils.hasClass(
          navbar.querySelector(Selector.NAVBAR_TOGGLER),
          ClassNames.COLLAPSED
        )
      ) {
        navbar.classList.add(bgClassName);
        navbar.style.backgroundImage = backgroundImage;
      }

      if (window.innerWidth <= breakPoint) {
        navbar.style.transition = utils.hasClass(navbarCollapse, "show")
          ? transition
          : "none";
      }
    });

    navbarCollapse.addEventListener(Events.SHOW_BS_COLLAPSE, () => {
      navbar.classList.add(bgClassName);
      navbar.style.backgroundImage = backgroundImage;
      navbar.style.transition = transition;
    });

    navbarCollapse.addEventListener(Events.HIDE_BS_COLLAPSE, () => {
      navbar.classList.remove(bgClassName);
      !html.scrollTop && (navbar.style.backgroundImage = "none");
    });

    navbarCollapse.addEventListener(Events.HIDDEN_BS_COLLAPSE, () => {
      navbar.style.transition = "none";
    });
  }
};

export default navbarDarkenOnScroll;
