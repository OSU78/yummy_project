import React, { useRef, useLayoutEffect } from "react";
import gsap from "gsap";
import styles from '../../../css/yummyGame.module.css';

const Dice = ({ value }) => {
    const faces = [value, ...gsap.utils.shuffle([1, 2, 3, 4, 5, 6].filter(v => v !== value))];
    const diceRef = useRef();

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(diceRef.current, {
                rotationX: 'random(720, 1080)',
                rotationY: 'random(720, 1080)',
                rotationZ: 0,
                duration: 'random(2, 3)'
            });
        }, diceRef);

        return () => ctx.revert();
    }, [value]);

    return (
        <div className={styles.dice_container}>
            <div className={styles.dice} ref={diceRef}>
                {faces?.map((faceValue, index) => (
                    <div key={index} className={styles.face}>
                        <div className={styles.dotParent}>
                            {[...Array(faceValue > 0 ? faceValue : 1)].map((_, dotIndex) => (
                                <div key={dotIndex} className={styles.dot} />
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Dice;