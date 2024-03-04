"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv = __importStar(require("dotenv"));
const typeorm_1 = require("typeorm");
const models_1 = require("./models");
require("reflect-metadata");
dotenv.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
// Middleware
app.use(express_1.default.json());
// Cors
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});
// Database connection
const dataSource = new typeorm_1.DataSource({
    type: 'sqlite',
    database: 'database.db',
    entities: [models_1.Product],
    synchronize: true,
});
dataSource
    .initialize()
    .then(() => {
    console.log('Connected to SQLite database');
})
    .catch((error) => {
    console.error('Error connecting to database:', error.message);
});
app.get('/', (req, res) => {
    res.send('Welcome to the Product API!');
});
app.get('/products', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { limit, offset, search, sort, order } = req.query;
        const query = {
            skip: offset ? Number(offset) : 0,
            take: limit ? Number(limit) : 10,
            where: [{}],
            order: {},
        };
        if (search) {
            query.where = [
                {
                    price: (0, typeorm_1.Not)(0),
                    name: (0, typeorm_1.ILike)(`%${search}%`),
                },
                {
                    price: (0, typeorm_1.Not)(0),
                    description: (0, typeorm_1.ILike)(`%${search}%`),
                },
            ];
        }
        else {
            query.where = [{ price: (0, typeorm_1.Not)(0) }];
        }
        if (sort === 'price') {
            query.order = { price: order === 'DESC' ? 'DESC' : 'ASC' };
        }
        const [products, total] = yield models_1.Product.findAndCount(query);
        res.json({ products, total });
    }
    catch (error) {
        next(error);
    }
}));
app.post('/products', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, description, price, image, url } = req.body;
        // Validate input using Joi or other validation library
        // Create a new product in the database
        // Return the newly created product
        res.status(201).json({ message: 'Product created successfully' });
    }
    catch (error) {
        next(error);
    }
}));
// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err.message);
    res.status(500).json({ error: 'Internal server error' });
});
// Start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
module.exports = app;
