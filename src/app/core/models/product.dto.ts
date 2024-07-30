export class ProductDTO {
    id: string;
    name: string;
    description: string;
    logo: string;
    date_release: string;
    date_revision: string;

    constructor(
        id: string,
        name: string,
        description: string,
        logo: string,
        date_release: string,
        date_revision: string
    ) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.logo = logo;
        this.date_release = date_release;
        this.date_revision = date_revision;
    }

    toJSON(): object {
        return {
            id: this.id,
            name: this.name,
            description: this.description,
            logo: this.logo,
            date_release: this.date_release,
            date_revision: this.date_revision
        };
    }

}