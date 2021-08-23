import { useCallback, useLayoutEffect, useMemo, useState } from "react";
import { StyleSheet, View, Text } from "react-native";
import { RectButton } from "react-native-gesture-handler";
import { setStatusBarStyle } from "expo-status-bar";
import { MaterialIcons } from "@expo/vector-icons";
import { useLayout, useButton, useInput } from "tools";
import { lightSeaGreen } from "tools/styles/colors";
import config from "tools/styles/config";
import { titleStyles, bodyStyles } from "tools/styles/text";
import {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from "react-native-reanimated";

export function useStore() {
  const {
    create,
    compose,
    borderBottomLeftRadius,
    borderBottomRightRadius,
    borderTopLeftRadius,
    borderTopRightRadius,
  } = {
    ...useMemo(() => StyleSheet, []),
    borderBottomLeftRadius: useSharedValue(75),
    borderBottomRightRadius: useSharedValue(0),
    borderTopLeftRadius: useSharedValue(0),
    borderTopRightRadius: useSharedValue(75),
  };
  const { animatedContainerStyles, animatedContentStyles } = {
    animatedContainerStyles: useAnimatedStyle(() => ({
      borderBottomLeftRadius: withSpring(borderBottomLeftRadius.value, config),
      borderBottomRightRadius: withSpring(
        borderBottomRightRadius.value,
        config
      ),
    })),
    animatedContentStyles: useAnimatedStyle(() => ({
      borderTopLeftRadius: withSpring(borderTopLeftRadius.value, config),
      borderTopRightRadius: withSpring(borderTopRightRadius.value, config),
    })),
  };

  useLayoutEffect(() => {
    setStatusBarStyle("light");
    return setStatusBarStyle.bind(null, "dark");
  });

  return {
    styles: useMemo(
      () => ({
        ...create({
          buttonStyles: {
            alignSelf: "center",
          },
        }),
        layoutStyles: {
          contentStyles: compose(
            create({
              styles: {
                paddingHorizontal: 40,
                paddingBottom: 30,
                paddingTop: 40,
              },
            }).styles,
            animatedContentStyles
          ),
          containerStyles: compose(animatedContainerStyles),
        },
        titleStyles: [
          titleStyles(2),
          create({
            styles: {
              textAlign: "center",
            },
          }).styles,
        ],
        subTitleStyles: [
          bodyStyles,
          create({
            styles: {
              textAlign: "center",
              paddingHorizontal: "8%",
              paddingBottom: 10,
            },
          }).styles,
        ],
        userStyles: create({
          containerStyles: {
            flexDirection: "row",
            justifyContent: "space-between",
          },
          forgotPasswordStyles: {
            color: lightSeaGreen(),
            fontFamily: "SFProDisplayMedium",
          },
        }),
      }),
      [animatedContainerStyles, animatedContentStyles, compose, create]
    ),
    inputs: useMemo(
      () => [
        {
          id: "Enter your email",
          keyboardType: "email-address",
          textContentType: "emailAddress",
          icon: "mail-outline",
          onValidate(email) {
            return /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
              String(email).toLowerCase()
            );
          },
        },
        {
          id: "Enter your password",
          textContentType: "password",
          icon: "lock-outline",
          onValidate(password) {
            if (
              password.match(/[a-z]/g) &&
              password.match(/[A-Z]/g) &&
              password.match(/[0-9]/g) &&
              password.length >= 8
            ) {
              return true;
            }
            return false;
          },
        },
      ],
      []
    ),
    View,
    Text,
    Input: useInput,
    Layout: useLayout,
    Button: useButton,
    Checkbox: useMemo(() => {
      function useCheckbox() {
        const [isChecked, check] = useState(false);
        const { containerStyles, textStyles, checkboxStyles } = {
          checkboxStyles: useMemo(
            () =>
              create({
                styles: {
                  height: 18,
                  width: 18,
                  backgroundColor: isChecked ? lightSeaGreen() : "transparent",
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: 2.4,
                  borderWidth: 1.4,
                  borderColor: lightSeaGreen(),
                },
              }).styles,
            [isChecked]
          ),
          ...useMemo(
            () =>
              create({
                containerStyles: {
                  flexDirection: "row",
                  justifyContent: "space-between",
                },
                textStyles: {
                  fontFamily: "SFProDisplayMedium",
                  paddingLeft: 10,
                },
              }),
            []
          ),
        };

        return (
          <RectButton
            style={containerStyles}
            onPress={check.bind(null, (old) => !old)}
            activeOpacity={0}
          >
            <View style={checkboxStyles}>
              <MaterialIcons name="check" size={11} color="white" />
            </View>

            <Text style={textStyles}>Remember me</Text>
          </RectButton>
        );
      }
      return useCheckbox;
    }, [create]),
    onLogin: useCallback(() => {
      borderBottomLeftRadius.value = 0;
      borderTopLeftRadius.value = withDelay(200, withTiming(75));
      borderTopRightRadius.value = withDelay(300, withTiming(0));
      borderBottomRightRadius.value = withDelay(600, withTiming(75));
    }, [
      borderBottomLeftRadius,
      borderBottomRightRadius,
      borderTopLeftRadius,
      borderTopRightRadius,
    ]),
  };
}
