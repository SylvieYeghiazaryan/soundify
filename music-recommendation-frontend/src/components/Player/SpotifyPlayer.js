import React, { useEffect, useState } from "react";
import { Button, Slider, message, Typography } from "antd";
import {
    PlayCircleOutlined,
    PauseCircleOutlined,
    StepForwardOutlined,
    StepBackwardOutlined,
} from "@ant-design/icons";

const { Text } = Typography;

const SpotifyPlayerComponent = ({ accessToken, uris }) => {
    const [player, setPlayer] = useState(null);
    const [deviceId, setDeviceId] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentSong, setCurrentSong] = useState({
        title: "No Song Playing",
        artist: "No Artist",
        albumCover: null,
    });
    const [volume, setVolume] = useState(50);

    // Effect hook to initialize Spotify Web Playback SDK when the component mounts
    useEffect(() => {
        const loadSpotifySDK = () => {
            window.onSpotifyWebPlaybackSDKReady = () => {
                // Initialize the Spotify player with authentication token
                const spotifyPlayer = new window.Spotify.Player({
                    name: "Soundify Web Player",
                    getOAuthToken: (cb) => cb(accessToken),
                });

                setPlayer(spotifyPlayer);

                // Add listener for player readiness
                spotifyPlayer.addListener("ready", ({ device_id }) => {
                    console.log("Player is ready with Device ID:", device_id);
                    setDeviceId(device_id);
                });

                // Add listener for changes in player state (track changes, pause/resume)
                spotifyPlayer.addListener("player_state_changed", (state) => {
                    if (state) {
                        const currentTrack = state.track_window.current_track;
                        setIsPlaying(!state.paused);
                        setCurrentSong({
                            title: currentTrack.name,
                            artist: currentTrack.artists.map((artist) => artist.name).join(", "),
                            albumCover: currentTrack.album.images[0]?.url || null,
                        });
                    }
                });
                // Connect the player to Spotify
                spotifyPlayer.connect();
            };

            // Load Spotify Web Playback SDK if not already loaded
            if (!window.Spotify) {
                const script = document.createElement("script");
                script.src = "https://sdk.scdn.co/spotify-player.js";
                script.async = true;
                document.body.appendChild(script);
            } else {
                window.onSpotifyWebPlaybackSDKReady();
            }
        };

        loadSpotifySDK();

        return () => player && player.disconnect();
    }, [accessToken]);

    // Function to start playback of a given list of tracks
    const playTracks = (trackURIs) => {
        if (!deviceId) {
            return;
        }
        if (!trackURIs || trackURIs.length === 0) {
            message.error("No tracks provided for playback.");
            return;
        }
        fetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`, {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ uris: trackURIs }),
        })
            .then((res) => {
                if (res.ok) {
                    setIsPlaying(true);
                } else {
                    console.error("Failed to start playback:", res.status, res.statusText);
                }
            })
            .catch((err) => {
                console.error("Error starting playback:", err);
            });
    };

    // Automatically start playback if new track URIs are provided
    useEffect(() => {
        if (uris && uris.length > 0) {
            playTracks(uris);
        }
    }, [uris]);

    // Function to pause playback
    const pausePlayback = () => {
        if (player) {
            player.pause().then(() => {
                setIsPlaying(false);
            });
        }
    };

    // Function to resume playback
    const resumePlayback = () => {
        if (player) {
            player.resume().then(() => {
                setIsPlaying(true);
            });
        }
    };

    // Function to resume playback
    const changeVolume = (value) => {
        setVolume(value);
        if (player) {
            player.setVolume(value / 100).then(() => {
                message.info(`Volume set to ${value}%`);
            });
        }
    };

    return (
        <div style={styles.playerContainer}>
            <div style={styles.metaContainer}>
                {currentSong.albumCover ? (
                    <img
                        src={currentSong.albumCover}
                        alt="Album Cover"
                        style={styles.albumCover}
                    />
                ) : (
                    <div style={styles.albumCoverPlaceholder}>No Cover</div>
                )}
                <div style={styles.songDetails}>
                    <Text strong>{currentSong.title}</Text>
                    <br />
                    <Text type="secondary">{currentSong.artist}</Text>
                </div>
            </div>
            <div style={styles.controlsContainer}>
                <Button
                    icon={<StepBackwardOutlined />}
                    onClick={() => player && player.previousTrack()}
                    style={styles.controlButton}
                />
                {isPlaying ? (
                    <Button
                        icon={<PauseCircleOutlined />}
                        onClick={pausePlayback}
                        style={styles.playPauseButton}
                    />
                ) : (
                    <Button
                        icon={<PlayCircleOutlined />}
                        onClick={resumePlayback}
                        style={styles.playPauseButton}
                    />
                )}
                <Button
                    icon={<StepForwardOutlined />}
                    onClick={() => player && player.nextTrack()}
                    style={styles.controlButton}
                />
                <Slider
                    value={volume}
                    onChange={changeVolume}
                    min={0}
                    max={100}
                    style={styles.volumeSlider}
                />
            </div>
        </div>
    );
};

export default SpotifyPlayerComponent;

const styles = {
    playerContainer: {
        position: "fixed",
        bottom: "0",
        left: "0",
        width: "100%",
        backgroundColor: "#FFF",
        padding: "10px 25px",
        color: "#FFFFFF",
        textAlign: "center",
        boxShadow: "0 -2px 10px rgba(0, 0, 0, 0.5)",
        zIndex: 1000,
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
    },
    metaContainer: {
        display: "flex",
        alignItems: "center",
        gap: "15px",
        marginBottom: "10px",
    },
    albumCover: {
        width: "60px",
        height: "60px",
        borderRadius: "5px",
        objectFit: "cover",
        boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.3)",
    },
    albumCoverPlaceholder: {
        width: "60px",
        height: "60px",
        borderRadius: "5px",
        backgroundColor: "#FFF",
        color: "#FFF",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "12px",
    },
    songDetails: {
        textAlign: "left",
    },
    controlsContainer: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: "20px",
    },
    controlButton: {
        color: "#FFFFFF",
        backgroundColor: "#1890ff",
        border: "none",
        fontSize: "20px",
        padding: "10px",
        borderRadius: "8px",
    },
    playPauseButton: {
        color: "#FFFFFF",
        backgroundColor: "#1890ff",
        border: "none",
        fontSize: "24px",
        padding: "10px 15px",
        borderRadius: "12px",
    },
    volumeSlider: {
        width: "150px",
        margin: "0 20px",
    },
};