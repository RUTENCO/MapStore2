/* eslint-disable no-console */
/*
 * Copyright 2024, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { useState } from 'react'; // Importa React y useState para manejar el estado del hover
import PropTypes from 'prop-types';
import { createPlugin } from "../../utils/PluginsUtils";
// import Menu from './components/Menu';
import Button from '../../components/layout/Button';
import Spinner from '../../components/layout/Spinner';
import Icon from './components/Icon';
/* import HTML from '../../components/I18N/HTML'; */
import Message from '../../components/I18N/Message';
// import FlexBox from '../../components/layout/FlexBox';
// import usePluginItems from '../../hooks/usePluginItems';
import { withResizeDetector } from 'react-resize-detector';
function FooterMenuItem({
    className,
    loading,
    glyph,
    iconType,
    labelId,
    onClick,
    label
}) {
    return (
        <li>
            <Button
                onClick={onClick}
                className={className}
            >
                {loading ? <Spinner /> : <Icon glyph={glyph} type={iconType} />}
                {' '}
                {labelId ? <Message msgId={labelId} /> : label}
            </Button>
        </li>
    );
}

FooterMenuItem.propTypes = {
    className: PropTypes.string,
    loading: PropTypes.bool,
    glyph: PropTypes.string,
    iconType: PropTypes.string,
    labelId: PropTypes.string,
    onClick: PropTypes.func
};

FooterMenuItem.defaultProps = {
    iconType: 'glyphicon',
    onClick: () => { }
};

/**
 * This plugin shows the footer
 * @memberof plugins
 * @class
 * @name Footer
 * @prop {boolean} cfg.customFooter params that can be used to render a custom html to be used instead of the default one
 * @prop {string} cfg.customFooterMessageId replace custom footer translations message identifier
 * @prop {object[]} cfg.menuItems list of menu items objects
 * @prop {boolean} cfg.hideMenuItems hide menu items menu
 * @prop {object[]} items this property contains the items injected from the other plugins,
 * using the `containers` option in the plugin that want to inject new menu items.
 * ```javascript
 * const MyMenuItemComponent = connect(selector, { onActivateTool })(({
 *  component, // default component that provides a consistent UI (see BrandNavbarMenuItem in BrandNavbar plugin for props)
 *  variant, // one of style variant (primary, success, danger or warning)
 *  size, // button size
 *  className, // custom class name provided by configuration
 *  onActivateTool, // example of a custom connected action
 * }) => {
 *  const ItemComponent = component;
 *  return (
 *      <ItemComponent
 *          className="my-class-name"
 *          loading={false}
 *          glyph="heart"
 *          iconType="glyphicon"
 *          labelId="myMessageId"
 *          onClick={() => onActivateTool()}
 *      />
 *  );
 * });
 * createPlugin(
 *  'MyPlugin',
 *  {
 *      containers: {
 *          Footer: {
 *              name: "TOOLNAME", // a name for the current tool.
 *              target: 'menu',
 *              Component: MyMenuItemComponent
 *          },
 * // ...
 * ```
 * @example
 * {
 *  "name": "Footer",
 *  "cfg": {
 *      "menuItems": [
 *          {
 *              "type": "link",
 *              "href": "/my-link",
 *              "target": "blank",
 *              "glyph": "heart",
 *              "labelId": "myMessageId",
 *              "variant": "default"
 *          },
 *          {
 *              "type": "logo",
 *              "href": "/my-link",
 *              "target": "blank",
 *              "src": "/my-image.jpg",
 *              "style": {}
 *          },
 *          {
 *              "type": "button",
 *              "href": "/my-link",
 *              "target": "blank",
 *              "glyph": "heart",
 *              "iconType": "glyphicon",
 *              "tooltipId": "myMessageId",
 *              "variant": "default",
 *              "square": true
 *          },
 *          {
 *              "type": "divider"
 *          },
 *          {
 *              "type": "message",
 *              "labelId": "myTranslationMessageId"
 *          }
 *      ]
 *  }
 * }
 */
function Footer({
    // menuItems: menuItemsProp,
    // hideMenuItems,
    // items
    /**  customFooter,
    customFooterMessageId **/
} /* , context */) {
    // const { loadedPlugins } = context;
    // const ref = useRef();
    // const configuredItems = usePluginItems({ items, loadedPlugins });
    // const pluginMenuItems = configuredItems.filter(({ target }) => target === 'menu').map(item => ({ ...item, type: 'plugin' }));
    /* const menuItems = [
        ...menuItemsProp.map((menuItem, idx) => ({ ...menuItem, position: idx + 1 })),
        ...pluginMenuItems
    ].sort((a, b) => a.position - b.position); */

    const [message, setMessage] = useState(null); // Estado para el mensaje
    const [messageType, setMessageType] = useState(null); // Estado para el tipo de mensaje (éxito o error)

    return (
        <>
            <div
                style={{
                    backgroundColor: '#004884',
                    color: '#fff',
                    padding: '20px',
                    borderTop: '1px solid #ddd',
                    marginBottom: '20px'
                }}
            >
                <h3 style={{ marginBottom: '15px' }}><Message msgId="form.title" /></h3>
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        const formData = new FormData(e.target);
                        const data = {
                            nombre: formData.get('nombre'),
                            telefono: formData.get('telefono'),
                            descripcion: formData.get('descripcion')
                        };

                        fetch('http://localhost:3001/send-email', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(data)
                        })
                            .then((response) => {
                                if (response.ok) {
                                    console.log('Enviando PQRS:', data);
                                    setMessage("Su PQRS ha sido enviada correctamente.");
                                    setMessageType("success");
                                } else {
                                    console.error('Error al enviar PQRS:');
                                    setMessage("Hubo un error al enviar su PQRS. Por favor, inténtelo de nuevo.");
                                    setMessageType("error");
                                }
                            })
                            .catch((error) => {
                                console.error('Error al enviar PQRS:', error);
                                setMessage("Hubo un error al enviar su PQRS. Por favor, inténtelo de nuevo.");
                                setMessageType("error");
                            });
                    }}
                >
                    <div style={{ marginBottom: '10px' }}>
                        <label htmlFor="nombre"><Message msgId="form.name" /></label>
                        <input
                            type="text"
                            id="nombre"
                            name="nombre"
                            required
                            style={{
                                width: '100%',
                                padding: '8px',
                                marginTop: '5px',
                                border: '1px solid #ccc',
                                color: '#000',
                                borderRadius: '4px'
                            }}
                        />
                    </div>
                    <div style={{ marginBottom: '10px' }}>
                        <label htmlFor="telefono"><Message msgId="form.phone" /></label>
                        <input
                            type="tel"
                            id="telefono"
                            name="telefono"
                            required
                            style={{
                                width: '100%',
                                padding: '8px',
                                marginTop: '5px',
                                border: '1px solid #ccc',
                                color: '#000',
                                borderRadius: '4px'
                            }}
                        />
                    </div>
                    <div style={{ marginBottom: '10px' }}>
                        <label htmlFor="descripcion"><Message msgId="form.description" /></label>
                        <textarea
                            id="descripcion"
                            name="descripcion"
                            rows="4"
                            required
                            style={{
                                width: '100%',
                                padding: '8px',
                                marginTop: '5px',
                                border: '1px solid #ccc',
                                borderRadius: '4px',
                                color: '#000'
                            }}
                        ></textarea>
                    </div>

                    <HoverButton />
                </form>

                {/* Mostrar mensaje de éxito o error */}
                {message && (
                    <div
                        style={{
                            backgroundColor: messageType === "success" ? '#3366CC' : '#CC3333',
                            color: '#ffffff',
                            padding: '10px',
                            marginTop: '10px',
                            border: '1px solid',
                            borderColor: messageType === "success" ? '#c3e6cb' : '#e6c3c3',
                            borderRadius: '4px'
                        }}
                    >
                        {message}
                    </div>
                )}
            </div>
            {/* Fin del formulario PQRS */}
            {/* Footer */}
            <div
                style={{
                    backgroundColor: '#1D59C9', // Fondo azul
                    width: '100%',
                    height: '96px',
                    background: '#36c',
                    display: 'flex',
                    padding: '0 80px'
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    {/* Contenedor para las imágenes */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                        <a href="https://colombia.co/" target="_blank" rel="noopener noreferrer">
                            <img
                                src="../../product/assets/img/co_colombia.png"
                                alt="Image 1"
                                style={{
                                    width: '60px',
                                    height: '58.81px',
                                    objectFit: 'contain'
                                }}
                            />
                        </a>
                        <div
                            style={{
                                borderRight: '1px solid white',
                                width: '1px',
                                height: '66px', // Altura igual a la de las imágenes
                                margin: '0 10px' // Espaciado alrededor del separador
                            }}
                        ></div>
                        <a href="https://www.gov.co/" target="_blank" rel="noopener noreferrer">
                            <img
                                src="../../product/assets/img/logo_gov_co.svg"
                                alt="Image 2"
                                style={{
                                    width: '172.09px',
                                    height: '34.67px',
                                    objectFit: 'contain'
                                }}
                            />
                        </a>
                    </div>

                    {/*
                {!hideMenuItems || menuItems.length === 0 ? (
                    <FlexBox
                        ref={ref}
                        component="footer"
                        id="ms-footer"
                        className="ms-footer _padding-xs"
                        centerChildren
                    >
                        <Menu
                            centerChildrenVertically
                            gap="md"
                            alignRight
                            wrap
                            menuItemComponent={FooterMenuItem}
                            items={menuItems}
                        />
                    </FlexBox>
                ) : null} */}
                </div>
            </div>
        </>
    );
}

// Componente para el botón con hover
function HoverButton() {
    const [hover, setHover] = useState(false);

    return (
        <button
            type="submit"
            style={{
                backgroundColor: hover ? '#004884' :  '#3366CC', // Cambia el color al pasar el cursor
                color: '#fff',
                padding: '10px 15px',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                transition: 'background-color 0.3s ease' // Suaviza la transición
            }}
            onMouseEnter={() => setHover(true)} // Detecta cuando el cursor entra
            onMouseLeave={() => setHover(false)} // Detecta cuando el cursor sale
        >
            <Message msgId="form.submit" />
        </button>
    );
}

Footer.propTypes = {
    menuItems: PropTypes.array,
    hideMenuItems: PropTypes.bool,
    items: PropTypes.array,
    customFooter: PropTypes.bool,
    customFooterMessageId: PropTypes.string
};

Footer.contextTypes = {
    loadedPlugins: PropTypes.object
};

Footer.defaultProps = {
    menuItems: [
        {
            type: 'link',
            href: "https://docs.mapstore.geosolutionsgroup.com/",
            target: 'blank',
            glyph: 'book',
            labelId: 'resourcesCatalog.documentation'
        },
        {
            type: 'link',
            href: 'https://github.com/geosolutions-it/MapStore2',
            target: 'blank',
            label: 'GitHub',
            glyph: 'github'
        }
    ],
    customFooter: false,
    customFooterMessageId: 'home.footerCustomHTML'
};


export default createPlugin('Footer', {
    component: withResizeDetector(Footer)
});
