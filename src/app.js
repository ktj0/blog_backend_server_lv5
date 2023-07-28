import express from 'express';
import cookieParser from 'cookie-parser';
import routes from './routes/index.js';

export class ExpressApp {
    app = express();

    constructor() {
        this.setAppSettings();
        this.setAppRouter();
    }

    setAppSettings = () => {
        this.app.use(express.json());
        this.app.use(express.urlencoded({extended: false}));
        this.app.use(cookieParser());
    };

    setAppRouter = () => {
        this.app.use('/api', routes, (err, req, res, next) => {
            res.status(400).json({
                success: false,
                error: err.message,
            });
        });
    };
}

// const app = express();

// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());
// app.use('/api', routes);

// export default app;

