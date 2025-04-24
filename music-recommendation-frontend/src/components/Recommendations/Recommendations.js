import React from "react";
import { Card, Row, Col, Button } from "antd";

const RecommendationsList = ({ recommendations, onPlaySong }) => {
    return (
        <Row gutter={[16, 16]} style={{ marginTop: "16px" }}>
            {recommendations.map((song, index) => (
                <Col key={index} xs={24} sm={12} md={8} lg={6}>
                    <Card
                        hoverable
                        cover={
                            <img
                                alt="Album Cover"
                                src={song.albumCover ? song.albumCover : 'src/images/No_cover.jpeg'}
                                style={{ objectFit: "cover" }}
                            />
                        }
                    >
                        <div style={styles.metaContainer}>
                            <div>
                                <div style={styles.title}>{song.track_name}</div>
                                <div style={styles.artist}>{song.artist_name}</div>
                                {song.genre && <div style={styles.genre}>{song.genre}</div>}
                            </div>
                            <Button
                                type="primary"
                                size="large"
                                style={styles.playButton}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onPlaySong(song.uri);
                                }}
                            >
                                Play
                            </Button>
                        </div>
                    </Card>
                </Col>
            ))}
        </Row>
    );
};

export default RecommendationsList;

const styles = {
    metaContainer: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
    },
    title: {
        fontSize: "16px",
        fontWeight: "bold",
        color: "#000000",
    },
    artist: {
        fontSize: "14px",
        color: "#666666",
    },
    genre: {
        marginTop: "4px",
        fontSize: "12px",
        fontStyle: "italic",
        color: "#999999",
    },
    playButton: {
        backgroundColor: "#1890ff",
        border: "none",
        borderRadius: "4px",
        fontSize: "14px",
        padding: "6px 16px",
    },
};