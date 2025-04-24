import React from "react";
import { Select } from "antd";

const { Option } = Select;

const genres = ["Pop", "Rock", "Hip-Hop", "Jazz", "Classical", "Electronic", "R&B", "Metal", "Country", "Reggae"];

const GenreFilter = ({ selectedGenre, setSelectedGenre }) => {
    return (
        <div >
            <Select
                style={{ width: 200 }}
                placeholder={"Select the genre"}
                onChange={(value) => setSelectedGenre(value)}
            >
                {genres.map((genre) => (
                    <Option key={genre} value={genre}>
                        {genre}
                    </Option>
                ))}
            </Select>
        </div>
    );
};

export default GenreFilter;