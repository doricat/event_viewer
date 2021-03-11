export const windowScrollTop = () => {
    return document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;
};

export const isScrolledIntoView = (elem: HTMLHeadingElement) => {
    const docViewTop = windowScrollTop();
    const docViewBottom = windowScrollTop() + window.innerHeight;

    const elemTop = elem.offsetTop;
    var elemBottom = elemTop + elem.clientHeight;

    return (elemBottom <= docViewBottom) && (elemTop >= docViewTop);
};
