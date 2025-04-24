import React, {useEffect, useState} from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchListeningHistory } from "../store/slices/spotifySlice";
import { Typography, Layout, Button } from "antd";

import GenreFilter from "../components/Filters/GenreFilter";
import MoodFilter from "../components/Filters/MoodFilter";
import SearchBar from "../components/SearchBar/SearchBar";
import SpotifyPlayerComponent from "../components/Player/SpotifyPlayer";
import RecommendationsList from "../components/Recommendations/Recommendations";
import {
    fetchFilteredRecommendations,
    fetchRecommendations,
    fetchSearchRecommendations
} from "../store/slices/recommendationsSlice";

const { Title, Text } = Typography;
const { Header, Content } = Layout;

const MainPage = () => {
    const [trackURIs, setTrackURIs] = useState([]);
    const [selectedGenre, setSelectedGenre] = useState("");
    const [selectedMood, setSelectedMood] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [currentlyPlayingUri, setCurrentlyPlayingUri] = useState(null);

    const dispatch = useDispatch();
    const accessToken = useSelector((state) => state.spotify.accessToken);
    const listeningHistory = useSelector((state) => state.spotify.listeningHistory);
    const timeOfDay = useSelector((state) => state.spotify.timeOfDay);
    const recommendations = useSelector((state) => state.recommendations.recommendations);

    useEffect(() => {
        if (accessToken) {
            dispatch(fetchListeningHistory(accessToken));
        }
    }, [accessToken, dispatch]);


    useEffect(() => {
        if (listeningHistory.length > 0 && timeOfDay) {
            dispatch(
                fetchRecommendations({
                    time_of_day: timeOfDay,
                    listening_history: listeningHistory,
                    accessToken,
                })
            );
        }
    }, [listeningHistory, timeOfDay, accessToken, dispatch]);

    const handleFilterChange = () => {
        dispatch(
            fetchFilteredRecommendations({
                time_of_day: timeOfDay,
                listening_history: listeningHistory,
                genre: selectedGenre,
                mood: selectedMood,
                accessToken,
            })
        );
    };

    const handleSearchQuery = () => {
        dispatch(fetchSearchRecommendations({ query: searchQuery, accessToken }));
    };

    const playSong = (uri) => {
        setCurrentlyPlayingUri(uri);
        setTrackURIs([uri]);
    };

    return (
        <Layout style={styles.layout}>
            <Header style={styles.header}>
                <div style={styles.headerContent}>
                    <Title style={styles.brandName}>Soundify</Title>
                    <Text style={styles.tagline}>Your Personal AI Music Recommender</Text>
                </div>
            </Header>

            <Content style={styles.content}>
                <SearchBar
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    handleSearchQuery={handleSearchQuery}
                />

                <div style={styles.filtersContainer}>
                    <GenreFilter selectedGenre={selectedGenre} setSelectedGenre={setSelectedGenre} />
                    <MoodFilter selectedMood={selectedMood} setSelectedMood={setSelectedMood} />
                    <Button type="primary" onClick={handleFilterChange} style={styles.filterButton}>
                        Apply Filters
                    </Button>
                </div>

                <RecommendationsList
                    recommendations={recommendations}
                    onPlaySong={playSong}
                />
                <SpotifyPlayerComponent
                    accessToken={accessToken}
                    uris={trackURIs}
                />
            </Content>
        </Layout>
    );
};

export default MainPage;

const styles = {
    layout: {
        height: "100%",
        background: "linear-gradient(90deg, #4facfe 0%, #00f2fe 100%)",
    },
    header: {
        padding: "20px",
        textAlign: "center",
        backgroundColor: "transparent",
    },
    headerContent: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
    },
    brandName: {
        color: "#ffffff",
        fontWeight: "bold",
        fontSize: "48px",
        marginBottom: "8px",
    },
    tagline: {
        color: "#ffffff",
        fontSize: "16px",
        fontStyle: "italic",
    },
    content: {
        padding: "32px",
    },
    filtersContainer: {
        display: "flex",
        gap: "16px",
        marginBottom: "32px",
    },
    filterButton: {
        alignSelf: "center",
    },
};