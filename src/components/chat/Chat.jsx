import * as React from 'react';
import Mensajes from './Mensajes.jsx';
import {
    getMensajes,
    enviarMensaje,
    updateMensaje
} from '../../services/mensajes_service.js';
import {
    Grid,
    IconButton,
    InputAdornment,
    Paper,
    TextField
} from '@mui/material';
import { useState } from 'react';
import { useEffect } from 'react';
import SendIcon from '@mui/icons-material/Send';
import { Fragment } from 'react';

const Chat = (props) => {
    const { id } = props;
    const usuario_id = JSON.parse(localStorage.getItem('id'));
    const [mensajes, setMensajes] = useState([]);
    const [mensaje_input, setMensaje] = useState('');
    const paperRef = React.useRef(null);

    useEffect(() => {
        if (paperRef.current && mensajes.length > 0) {
            paperRef.current.scrollTop = paperRef.current.scrollHeight;
        }
    }, [mensajes]);

    useEffect(() => {
        getMensajes(id)
            .then((rpta) => {
                if (Array.isArray(rpta.data) && rpta.data.length > 0) {
                    setMensajes(rpta.data);
                }
            })
            .catch((error) => {
                console.log('Error al obtener los mensajes:', error);
            });
    }, [id]);

    const handleChange = (e) => {
        setMensaje(e.target.value);
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        let objMensaje = {
            id_equivalencia: id,
            texto: mensaje_input,
            id_remitente: usuario_id
        };
        enviarMensaje(objMensaje).then((rpta) => {
            setMensajes([...mensajes, rpta.data]);
            setMensaje('');
        });
    };

    const handleUpdate = (id) => {
        let objMensaje = {
            id: id,
            texto: mensaje_input
        };
        updateMensaje(objMensaje);
        getMensajes(id).then((rpta) => {
            setMensajes(rpta.data);
        });
    };

    return (
        <Fragment>
            <Paper
                elevation={8}
                variant="outlined"
                sx={{
                    width: '100%',
                    height: 500,
                    padding: 2,
                    mt: 4,
                    mb: 4,
                    overflow: 'auto',
                    display: 'flex',
                    flexDirection: 'column'
                }}
            >
                <div style={{ flex: 1, overflow: 'auto' }} ref={paperRef}>
                    <Mensajes mensajes={mensajes} usuario_id={usuario_id} />
                </div>

                <Grid
                    container
                    spacing={1}
                    pt={1}
                    sx={{
                        padding: 2
                    }}
                >
                    <TextField
                        type="text"
                        label="Escribe un mensaje"
                        variant="outlined"
                        fullWidth
                        value={mensaje_input}
                        onChange={handleChange}
                        onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                                handleSubmit(e);
                            }
                        }}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={handleSubmit}
                                        color="primary"
                                        size="medium"
                                        sx={{
                                            transition: 'all 0.3s ease',
                                            '&:hover': {
                                                backgroundColor: 'primary.main',
                                                color: 'white',
                                                cursor: 'pointer',
                                                transform: 'scale(1.1)'
                                            },
                                            '&:hover:not(:hover)': {
                                                backgroundColor: 'primary.main',
                                                color: 'white',
                                                cursor: 'pointer',
                                                transform: 'scale(1)'
                                            }
                                        }}
                                    >
                                        <SendIcon />
                                    </IconButton>
                                </InputAdornment>
                            )
                        }}
                    />
                </Grid>
            </Paper>
        </Fragment>
    );
};

export default Chat;
