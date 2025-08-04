import { useState } from 'react';
import {
    Box,
    Typography,
    Popover,
    MenuItem,
    TextField,
    InputAdornment,
    IconButton,
} from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';

import { formatStatLabel } from './PlayerCard';

function getNestedKeys(obj, prefix = '') {
    return Object.keys(obj).reduce((keys, key) => {
        const newPrefix = prefix ? `${prefix}.${key}` : key;
        
        // Handle scoring type consolidation
        if (['standard', 'half', 'ppr'].includes(key)) {
            // Replace the scoring type with {pointsType} placeholder
            const scoringPrefix = prefix ? `${prefix}.{pointsType}` : '{pointsType}';
            // Only process one scoring type (standard) to avoid duplicates
            if (key === 'standard') {
                return [...keys, ...getNestedKeys(obj[key], scoringPrefix)];
            }
            return keys;
        }
        
        // Regular nested object handling
        if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
            return [...keys, ...getNestedKeys(obj[key], newPrefix)];
        }
        
        // Only include if the value has a corresponding Rank field
        if (obj[`${key}Rank`] !== undefined) {
            return [...keys, newPrefix];
        }
        return keys;
    }, []);
}

function BlankCard({ stats, cards, onAdd }) {
    const [anchorEl, setAnchorEl] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
        setSearchTerm('');
    };

    const handleSelect = (statKey) => {
        onAdd(statKey);
        handleClose();
    };

    const open = Boolean(anchorEl);
    const statKeys = getNestedKeys(stats).filter(key => !cards.includes(key));
    
    const filteredKeys = statKeys.filter(key => 
        formatStatLabel(key, ["kicking", "dst", "{pointsType}"]).toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <>
            <Box
                sx={{
                    aspectRatio: '1 / 1',
                    backgroundColor: '#f5f5f5',
                    borderRadius: 2,
                    p: 1,
                    display: 'flex',
                    maxWidth: 100,
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    border: '1px dashed gray',
                    '&:hover': {
                        backgroundColor: '#e0e0e0',
                    }
                }}
                onClick={handleClick}
            >
                <Typography variant="button" color="text.secondary" align="center">
                    + Add Stat
                </Typography>
            </Box>
            <Popover
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
                PaperProps={{
                    sx: { 
                        maxHeight: 400,
                        width: 300,
                    }
                }}
            >
                <Box sx={{ p: 2 }}>
                    <TextField
                        fullWidth
                        size="small"
                        placeholder="Search stats..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon />
                                </InputAdornment>
                            ),
                            endAdornment: searchTerm && (
                                <InputAdornment position="end">
                                    <IconButton 
                                        size="small"
                                        onClick={() => setSearchTerm('')}
                                    >
                                        <CloseIcon />
                                    </IconButton>
                                </InputAdornment>
                            )
                        }}
                    />
                </Box>
                <Box sx={{ maxHeight: 300, overflow: 'auto' }}>
                    {filteredKeys.map((key) => (
                        <MenuItem 
                            key={key} 
                            onClick={() => handleSelect(key)}
                            sx={{ 
                                whiteSpace: 'normal',
                                wordBreak: 'break-word'
                            }}
                        >
                            {formatStatLabel(key, ["kicking", "dst", "{pointsType}"])}
                        </MenuItem>
                    ))}
                </Box>
            </Popover>
        </>
    );
}

export default BlankCard;