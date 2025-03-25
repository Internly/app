import { Text, TouchableOpacity, StyleSheet } from 'react-native'
import React from 'react'
import { colors } from '../../data/colors';

const Button = (props) => {
    const filledBgColor = props.color || colors.primary_mint;
    const outlinedColor = colors.light_mint;
    const bgColor = props.filled ? filledBgColor : outlinedColor;
    const textColor = props.textColor||"white"

    return (
        <TouchableOpacity
            style={{
                ...styles.button,
                ...{ backgroundColor: bgColor },
                ...props.style
            }}
            onPress={props.onPress}
        >
            <Text style={{ fontSize: 14, ... { color: textColor } }}>{props.title}</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    button: {
        paddingBottom: 16,
        paddingVertical: 10,
        alignItems: 'center',
        justifyContent: 'center'
    }
})
export default Button