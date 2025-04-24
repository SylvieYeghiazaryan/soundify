import React from "react";
import { Select } from "antd";

const { Option } = Select;

const moods = ["Happy", "Sad", "Energetic", "Relaxed", "Romantic", "Angry", "Focused", "Nostalgic"];

const MoodFilter = ({ selectedMood, setSelectedMood }) => {
    return (
        <div>
            <Select
                style={{ width: 200 }}
                placeholder={"Select the mood"}
                onChange={(value) => setSelectedMood(value)}
            >
                {moods.map((mood) => (
                    <Option key={mood} value={mood}>
                        {mood}
                    </Option>
                ))}
            </Select>
        </div>
    );
};

export default MoodFilter;