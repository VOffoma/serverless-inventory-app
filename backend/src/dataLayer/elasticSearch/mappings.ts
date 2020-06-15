const productMapping = {
        "properties": {
            "productId": {"type": "text"},
            "productName": {"type": "text"},
            "mass_g": {"type": "text"},
            "quantity": {"type": "integer"},
            "attachmentUrl": {"type": "text"},
            "addedAt": {
                "type": "date",
                "format": "strict_date_optional_time"
            }
        }
};

export function getMapping(entity: string): object {
    if(entity === 'product')
        return productMapping;
}