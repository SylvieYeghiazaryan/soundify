import React from "react";
import { Input, Button } from "antd";
import { SearchOutlined } from "@ant-design/icons";

const SearchBar = ({ searchQuery, setSearchQuery, handleSearchQuery }) => {
    return (
        <div style={{ marginBottom: "16px", display: "flex", alignItems: "center" }}>
            <Input
                style={{ width: 300, marginRight: "16px" }}
                placeholder="Tell me what you want to listen to..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                allowClear
            />
            <Button
                type="primary"
                icon={<SearchOutlined />}
                onClick={handleSearchQuery}
            >
                Search
            </Button>
        </div>
    );
};

export default SearchBar;