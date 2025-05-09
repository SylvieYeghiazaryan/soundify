import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setAccessToken, setTimeOfDay } from "../store/slices/spotifySlice";
import {determineCurrentTimeOfDay} from "../store/slices/spotifySlice";
import { Button, Card, Typography } from "antd";
import { LoginOutlined } from "@ant-design/icons";
import {CLIENT_ID, SCOPES, REDIRECT_URI} from "../constants";

const { Title, Text } = Typography;

const LoginPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Function to handle Spotify login and redirect the user to Spotify's authentication page.
    const loginToSpotify = () => {
        const authUrl = `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&response_type=token&redirect_uri=${REDIRECT_URI}&scope=${SCOPES}`;
        window.location.href = authUrl;
    };

    useEffect(() => {
        // Check if the access token is present in the URL hash parameters after redirect.
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const accessToken = hashParams.get("access_token");

        // If the access token exists, store it and set the time of day for recommendations.
        if (accessToken) {
            dispatch(setAccessToken(accessToken));

            localStorage.setItem("spotify_access_token", accessToken);

            const currentHour = new Date().getHours();
            const timeOfDay = determineCurrentTimeOfDay(currentHour);
            dispatch(setTimeOfDay(timeOfDay));

            // Navigate to the main page after successful login.
            navigate("/main");
        }
    }, [dispatch, navigate]);

    return (
        <div style={styles.pageContainer}>
            <Card style={styles.loginCard} hoverable>
                <Title level={2} style={styles.brandTitle}>
                    Soundify
                </Title>
                <Text style={styles.subtitle}>Your Personal AI Music Recommender</Text>

                <div style={styles.spacer}></div>

                <Button
                    type="primary"
                    shape="round"
                    icon={<LoginOutlined />}
                    size="large"
                    style={styles.loginButton}
                    onClick={loginToSpotify}
                >
                    Login with Spotify
                </Button>
            </Card>
        </div>
    );
};

export default LoginPage;

const styles = {
    pageContainer: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        background: "linear-gradient(90deg, #4facfe 0%, #00f2fe 100%)",
    },
    loginCard: {
        width: 400,
        textAlign: "center",
        padding: "32px",
        borderRadius: "10px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
        backgroundColor: "#ffffff",
    },
    brandTitle: {
        color: "#1890ff",
        fontWeight: "bold",
        fontSize: "36px",
    },
    subtitle: {
        color: "#595959",
        fontSize: "16px",
        marginTop: "8px",
    },
    spacer: {
        marginTop: "32px",
    },
    loginButton: {
        backgroundColor: "#1890ff",
        borderColor: "#1890ff",
        color: "#ffffff",
    },
};