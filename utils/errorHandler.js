function errorHandler(err, req, res, next) {
    console.error(err.stack);
    
    if (err.name === 'ValidationError') {
        return res.status(400).json({ 
            status: 400,
            message: "Erro de validação",
            errors: err.errors 
        });
    }
    
    res.status(500).json({ 
        status: 500,
        message: "Erro interno do servidor",
        error: err.message 
    });
}

module.exports = errorHandler;