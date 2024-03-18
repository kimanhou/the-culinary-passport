import React, {
    Dispatch,
    FC,
    MouseEvent,
    ReactNode,
    SetStateAction,
    useEffect,
    useRef,
    useState,
} from "react";
import useEffectSkipFirstRender from "hooks/useEffectSkipFirstRender";
import "./SideSheet.scss";

interface ISideSheetProps {
    isVisible: boolean;
    setIsVisible: Dispatch<SetStateAction<boolean>>;
    children: ReactNode;
    onEnter?: () => void;
    onExit?: () => void;
}

const SideSheet: FC<ISideSheetProps> = (props) => {
    const contentRef = useRef<HTMLDivElement | null>(null);
    const [isVisibleInternal, setIsVisibleInternal] = useState(props.isVisible);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const visibleClassName = isVisibleInternal ? "visible" : "";
    const isTransitioningClassName = isTransitioning ? "is-transitioning" : "";

    const onOutsideClick = () => {
        props.setIsVisible((t) => !t);
    };

    const onContentClick = (e: MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
    };

    useEffect(() => {
        const onTransitionStart = () => {
            setIsTransitioning(true);
        };
        contentRef.current?.addEventListener(
            "transitionstart",
            onTransitionStart
        );

        const onTransitionEnd = () => {
            setIsTransitioning(false);
        };
        contentRef.current?.addEventListener("transitionend", onTransitionEnd);

        return () => {
            contentRef.current?.removeEventListener(
                "transitionstart",
                onTransitionStart
            );
            contentRef.current?.removeEventListener(
                "transitionend",
                onTransitionEnd
            );
        };
    }, []);

    useEffectSkipFirstRender(() => {
        setIsVisibleInternal(props.isVisible);
        setIsTransitioning(true);
    }, [props.isVisible]);

    useEffect(() => {
        if (isVisibleInternal && !isTransitioning) {
            // On enter
            if (props.onEnter) {
                props.onEnter();
            }
        }

        if (!isVisibleInternal && !isTransitioning) {
            // On exit
            if (props.onExit) {
                props.onExit();
            }
        }
    }, [isVisibleInternal, isTransitioning]);

    return (
        <div
            className={`side-sheet ${visibleClassName} ${isTransitioningClassName}`}
            onClick={onOutsideClick}
        >
            <div
                className={`side-sheet-content-container`}
                onClick={onContentClick}
                ref={contentRef}
            >
                {(isVisibleInternal || isTransitioning) && props.children}
            </div>
        </div>
    );
};

export default SideSheet;
