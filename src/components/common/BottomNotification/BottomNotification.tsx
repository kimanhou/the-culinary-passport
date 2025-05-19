import {
    Dispatch,
    FC,
    MouseEvent,
    ReactNode,
    SetStateAction,
    useEffect,
    useRef,
    useState,
} from "react";
import useEffectSkipFirstRender from "@/hooks/useEffectSkipFirstRender";
import { useDeviceType } from "@/hooks/useMedia";
import { isSafariNotMobile as isSafariFunc } from "@/ts/utils";
import styles from "./BottomNotification.module.scss";
import CloseIcon from "@/assets/CloseIcon";

interface IBottomNotificationProps {
    isVisible: boolean;
    setIsVisible: Dispatch<SetStateAction<boolean>>;
    children: ReactNode;
    onEnter?: () => void;
    onExit?: () => void;
    backgroundColor?: string;
    withBackdrop?: boolean;
}

const BottomNotification: FC<IBottomNotificationProps> = (props) => {
    const deviceType = useDeviceType();
    const contentRef = useRef<HTMLDivElement | null>(null);
    const hiddenContentRef = useRef<HTMLDivElement | null>(null);
    const [isVisibleInternal, setIsVisibleInternal] = useState(props.isVisible);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [top, setTop] = useState<number | string>("100%");
    const [isSafari, setIsSafari] = useState(false);

    const withBackdropClassName = props.withBackdrop ? styles.withBackdrop : "";
    const visibleClassName = isVisibleInternal ? styles.visible : "";
    const isTransitioningClassName = isTransitioning
        ? styles.isTransitioning
        : "";

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
            // eslint-disable-next-line react-hooks/exhaustive-deps
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
        setIsSafari(isSafariFunc(deviceType));
    }, []);

    useEffectSkipFirstRender(() => {
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isVisibleInternal, isTransitioning]);

    useEffect(() => {
        if (hiddenContentRef.current && props.isVisible) {
            const viewportHeightUnit = isSafari ? "vh" : "dvh";
            setTop(
                `calc(100${viewportHeightUnit} - ${hiddenContentRef.current.clientHeight}px)`
            );
            document.body.style.overflow = "hidden";
        } else if (!props.isVisible) {
            setTop("100%");
            document.body.style.overflow = "unset";
        }
    }, [props.children, props.isVisible]);

    return (
        <div
            className={`${styles.bottomNotification} ${visibleClassName} ${isTransitioningClassName} ${withBackdropClassName}`}
            onClick={onOutsideClick}
        >
            <div
                className={styles.bottomNotificationContentContainer}
                onClick={onContentClick}
                ref={contentRef}
                style={{ top, backgroundColor: props.backgroundColor }}
            >
                <span className={styles.closeButtonWrapper}>
                    <CloseIcon onClick={() => props.setIsVisible(false)} />
                </span>
                {(isVisibleInternal || isTransitioning) && props.children}
            </div>

            <div
                className={`${styles.bottomNotificationContentContainer} ${styles.hidden}`}
                ref={hiddenContentRef}
            >
                {props.children}
            </div>
        </div>
    );
};

export default BottomNotification;
