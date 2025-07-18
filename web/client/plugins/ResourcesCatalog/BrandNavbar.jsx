/*
 * Copyright 2024, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import { createPlugin } from "../../utils/PluginsUtils";
import FlexBox from '../../components/layout/FlexBox';
import Menu from './components/Menu';
import usePluginItems from '../../hooks/usePluginItems';
import Button from '../../components/layout/Button';
import tooltip from '../../components/misc/enhancers/tooltip';
import Spinner from '../../components/layout/Spinner';
import Icon from './components/Icon';
import PropTypes from 'prop-types';
import Message from '../../components/I18N/Message';
// import MenuNavLink from './components/MenuNavLink';
import src from '../../product/assets/img/logo.png';

const ButtonWithTooltip = tooltip(Button);

function BrandNavbarMenuItem({
    className,
    loading,
    glyph,
    iconType,
    labelId,
    onClick
}) {
    return (
        <li>
            <ButtonWithTooltip
                square
                borderTransparent
                tooltipId={labelId}
                tooltipPosition="bottom"
                onClick={onClick}
                className={className}
            >
                {loading ? <Spinner /> : <Icon glyph={glyph} type={iconType} />}
            </ButtonWithTooltip>
        </li>
    );
}

BrandNavbarMenuItem.propTypes = {
    className: PropTypes.string,
    loading: PropTypes.bool,
    glyph: PropTypes.string,
    iconType: PropTypes.string,
    labelId: PropTypes.string,
    onClick: PropTypes.func
};

BrandNavbarMenuItem.defaultProps = {
    iconType: 'glyphicon',
    onClick: () => {}
};

/**
 * This plugin provides a special Manager dropdown menu, that contains various administration tools
 * @memberof plugins
 * @class
 * @name BrandNavbar
 * @prop {object[]} cfg.leftMenuItems menu items configuration for left side
 * @prop {object[]} cfg.rightMenuItems menu items configuration for right side
 * @prop {object[]} items this property contains the items injected from the other plugins,
 * using the `containers` option in the plugin that want to inject new menu items.
 * ```javascript
 * const MyMenuButtonComponent = connect(selector, { onActivateTool })(({
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
 *          BrandNavbar: {
 *              name: "TOOLNAME", // a name for the current tool.
 *              Component: MyMenuButtonComponent
 *          },
 * // ...
 * ```
 * @example
 * {
 *  "name": "BrandNavbar",
 *  "cfg": {
 *      "containerPosition": "header",
 *      "leftMenuItems": [
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
 *          }
 *      ],
*      "rightMenuItems": [
*          {
*              "type": "button",
*              "href": "/my-link",
*              "target": "blank",
*              "glyph": "heart",
*              "labelId": "myMessageId",
*              "variant": "default"
*          }
*      ]
 *  }
 * }
 */
function BrandNavbar({
    size,
    variant,
    leftMenuItems,
    rightMenuItems,
    items
    // logo
}, context) {
    const { loadedPlugins } = context;
    const configuredItems = usePluginItems({ items, loadedPlugins });
    const pluginLeftMenuItems = configuredItems.filter(({ target }) => target === 'left-menu').map(item => ({ ...item, type: 'plugin' }));
    const pluginRightMenuItems = configuredItems.filter(({ target }) => target === 'right-menu').map(item => ({ ...item, type: 'plugin' }));
    return (
        <>
            {/* Header adicional con imagen y enlace */}
            <div
                style={{
                    backgroundColor: '#0C5ECA', // Fondo azul
                    width: '100%',
                    height: '48px',
                    padding: '0 60px', // Espaciado interno para mover la imagen hacia el centro
                    display: 'flex',
                    alignItems: 'center'
                }}
            >
                <a href="https://www.gov.co/" target="_blank" rel="noopener noreferrer">
                    <img
                        src="../../product/assets/img/cov_colombia.png"
                        alt="Header Image"
                        style={{
                            weight: '136px',
                            height: '24px', // Ajusta la altura de la imagen
                            objectFit: 'contain'
                        }}
                    />
                </a>
            </div>
            <FlexBox
                id="ms-brand-navbar"
                style={{ fontFamily: 'Montserrat, sans-serif' }}
                classNames={[
                    'ms-brand-navbar',
                    'ms-main-colors',
                    'shadow-md',
                    '_sticky',
                    '_corner-tl',
                    '_padding-lr-sm',
                    '_padding-tb-xs'
                ]}
                centerChildrenVertically
                gap="sm"
            >
                {/* Contenedor del logo, separador, segundo logo y texto */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginLeft: '50px' }}>
                    {/* Tu logo personalizado */}
                    <a href="/#" target="_self" rel="noopener noreferrer">
                        <img
                            src="../../product/assets/img/logo_udea.png"
                            alt="My Logo"
                            style={{
                                weight: '80px',
                                height: '80px', // Ajusta la altura de tu logo
                                objectFit: 'contain'
                            }}
                        />
                    </a>

                    {/* Línea vertical negra */}
                    <div
                        style={{
                            borderLeft: '1px solid black',
                            height: '48px', // Altura igual a la del logo
                            margin: '0 10px' // Espaciado alrededor del separador
                        }}
                    ></div>

                    {/* Segundo logo */}
                    <a href="/#" target="_self" rel="noopener noreferrer">
                        <img
                            src="../../product/assets/img/logo_udea_completo.png"
                            alt="Second Logo"
                            style={{
                                weight: '80px',
                                height: '80px', // Ajusta la altura del segundo logo
                                objectFit: 'contain'
                            }}
                        />
                    </a>
                    {/* Texto después del segundo logo */}
                    <a href="/#" target="_self" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center' }}>
                        <span
                            style={{
                                fontSize: '21px',
                                color: '#434343',
                                marginLeft: '10px',
                                fontFamily: 'Montserrat, sans-serif',
                                display: 'flex',
                                alignItems: 'center', // Centra el texto verticalmente
                                height: '80px' // Asegura que coincida con la altura de los logos
                            }}
                        >
                            <h1 style={{ margin: 0 }}><Message msgId="BrandNavbar.description" /></h1>
                        </span>
                    </a>
                </div>
                <FlexBox.Fill
                    component={Menu}
                    centerChildrenVertically
                    gap="xs"
                    size={size}
                    variant={variant}
                    menuItemComponent={BrandNavbarMenuItem}
                    items={[
                        ...leftMenuItems.map((menuItem, idx) => ({ ...menuItem, position: idx + 1 })),
                        ...pluginLeftMenuItems
                    ].sort((a, b) => a.position - b.position)}
                />
                <Menu
                    centerChildrenVertically
                    gap="xs"
                    variant={variant}
                    alignRight
                    size={size}
                    menuItemComponent={BrandNavbarMenuItem}
                    items={[
                        ...rightMenuItems.map((menuItem, idx) => ({ ...menuItem, position: idx + 1 })),
                        ...pluginRightMenuItems
                    ].sort((a, b) => a.position - b.position)}
                />
            </FlexBox>
        </>
    );
}

BrandNavbar.propTypes = {
    size: PropTypes.string,
    variant: PropTypes.string,
    leftMenuItems: PropTypes.array,
    rightMenuItems: PropTypes.array,
    items: PropTypes.array
};

BrandNavbar.contextTypes = {
    loadedPlugins: PropTypes.object
};

BrandNavbar.defaultProps = {
    logo: {
        src,
        href: '#/'
    },
    leftMenuItems: [],
    rightMenuItems: []
};

export default createPlugin('BrandNavbar', {
    component: BrandNavbar
});
