import React, { FunctionComponent, useState, useEffect, useMemo } from 'react';
import EventEmitter from 'events';
import { throttle } from 'throttle-debounce';

import { ObjectLiteral } from '../type';

const EVENT_EFFECT_RUN = 'effect.run';
const EVENT_ELEMENT_READY = 'element.ready';
const EFFECT_DATA_ATTRIBUTE = 'data-effects-node-id';
const EFFECT_SELECTOR = 'effects-node';

type WindowWithIds = typeof window & { __effectIds: string[] };
type ElementWithDataset = Element & { dataset: { effectsNodeId: string } };

export interface EffectProps {
    [EFFECT_DATA_ATTRIBUTE]: string;
    className: string;
    runEffect: boolean;
}

export type EffectsSupported =
    | 'fade-slide-left'
    | 'fade-slide-right'
    | 'fade-slide-top'
    | 'fade-slide-bottom';

export interface EffectProperties {
    effect?: EffectsSupported;
    effectTimeout?: number;
    runEffect?: boolean;
}
export const eventEmitter = new EventEmitter();
const IDGenerator = function*() {
    while (true) {
        // @ts-ignore
        if (
            typeof window !== 'undefined' &&
            (window as WindowWithIds).__effectIds &&
            (window as WindowWithIds).__effectIds.length
        ) {
            yield (window as WindowWithIds).__effectIds.shift()!;
        } else {
            yield (Math.random() * 100000000000000000).toString();
        }
    }
};

export const idGenerator = IDGenerator();

export const ids: string[] = [];

interface EffectHOCProps {
    children: any;
    effectTimeout?: number;
}

const Effect: FunctionComponent<EffectHOCProps> = ({
    children,
    effectTimeout = 0,
}) => {
    const nodeId = useMemo(() => {
        return idGenerator.next().value;
    }, []);
    const [runEffect, setRunEffect] = useState(false);

    const onEventFire = (id: string) => {
        if (id.toString() === nodeId.toString()) {
            setTimeout(() => setRunEffect(true), effectTimeout);
            eventEmitter.off(EVENT_EFFECT_RUN, onEventFire);
        }
    };

    useEffect(() => {
        eventEmitter.on(EVENT_EFFECT_RUN, onEventFire);
        return () => {
            eventEmitter.off(EVENT_EFFECT_RUN, onEventFire);
        };
    }, [eventEmitter, onEventFire]);

    const effectProps = useMemo(
        () => ({
            [EFFECT_DATA_ATTRIBUTE]: nodeId,
            className: EFFECT_SELECTOR,
            runEffect,
        }),
        [runEffect, nodeId],
    );

    const html = children(effectProps);

    useEffect(() => {
        setTimeout(() => eventEmitter.emit(EVENT_ELEMENT_READY, [nodeId]), 100);
    }, []);

    return html;
};

export const effect = ({
    effect = 'fade-slide-top',
    runEffect = false,
}: EffectProperties) => {
    let start = 'opacity: 0; transform: translateY(-20px);';
    let end = 'opacity: 1; transform: translateY(0);';

    if (effect === 'fade-slide-left') {
        start = 'opacity: 0; transform: translateX(-20px);';
        end = 'opacity: 1; transform: translateX(0);';
    } else if (effect === 'fade-slide-right') {
        start = 'opacity: 0; transform: translateX(20px);';
        end = 'opacity: 1; transform: translateX(0);';
    } else if (effect === 'fade-slide-bottom') {
        start = 'opacity: 0; transform: translateY(20px);';
        end = 'opacity: 1; transform: translateY(0);';
    }

    return `
        transition: all ease-out 300ms;
        ${start};
        ${runEffect ? end : ''}
    `;
};

export const withEffects = (Component: any) => {
    const WithEffects = (props: ObjectLiteral) => {
        return (
            <Effect effectTimeout={props.effectTimeout || 0}>
                {(effectProps: EffectProps) => {
                    const applyEffect = () =>
                        effect({
                            effect: props.effect,
                            runEffect: effectProps.runEffect,
                        });
                    return (
                        <Component
                            {...props}
                            {...effectProps}
                            effect={applyEffect}
                        />
                    );
                }}
            </Effect>
        );
    };

    const wrappedComponentName =
        Component.displayName || Component.name || 'Component';

    WithEffects.displayName = `withEffects(${wrappedComponentName})`;
    return WithEffects;
};

// returns all items present on the current page
const getItems = () =>
    document.querySelectorAll(`.${EFFECT_SELECTOR}`) as NodeListOf<
        ElementWithDataset
    >;

const processNode = (
    node: ElementWithDataset,
    id?: string,
    windowScrollTop?: number,
    windowBottom?: number,
) => {
    if (!id) {
        id = node.dataset.effectsNodeId;
    }

    if (windowScrollTop === undefined) {
        windowScrollTop = window.scrollY || window.pageYOffset;
    }

    if (windowBottom === undefined) {
        windowBottom = window.innerHeight + windowScrollTop;
    }

    const itemRect = node.getBoundingClientRect();
    const itemTop = itemRect.top + windowScrollTop;
    if (itemTop + Math.min(itemRect.height * 0.2, 200) < windowBottom) {
        node.classList.remove(EFFECT_SELECTOR);
        eventEmitter.emit(EVENT_EFFECT_RUN, [id]);
    }
};

const onWindowUpdate = throttle(200, () => {
    const windowScrollTop = window.scrollY || window.pageYOffset;
    const windowBottom = window.innerHeight + windowScrollTop;

    const items = getItems();
    for (let i = 0; i < items.length; i++) {
        processNode(items[i], undefined, windowScrollTop, windowBottom);
    }
});

export const start = () => {
    window.addEventListener('resize', onWindowUpdate, true);
    window.addEventListener('scroll', onWindowUpdate, true);

    eventEmitter.on(EVENT_ELEMENT_READY, ([id]: string[]) => {
        const node = document.querySelector(
            `[${EFFECT_DATA_ATTRIBUTE}="${id}"]`,
        ) as ElementWithDataset;
        if (node) {
            processNode(node);
        }
    });
};

export const stop = () => {
    window.removeEventListener('resize', onWindowUpdate);
    window.removeEventListener('scroll', onWindowUpdate);
};

export const getRenderedNodeIdCollector = () => (
    <script
        key="effects"
        dangerouslySetInnerHTML={{
            __html: `window.__effectIds = Array.from(document.querySelectorAll('.${EFFECT_SELECTOR}')).map(node => node.dataset.effectsNodeId);`,
        }}
    />
);
